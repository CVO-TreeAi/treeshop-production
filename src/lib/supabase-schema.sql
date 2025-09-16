-- Tree Shop Business Database Schema for Supabase
-- This schema supports lead generation, proposal management, and project tracking

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types for better data integrity
CREATE TYPE lead_temperature AS ENUM ('hot', 'warm', 'cold');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'quoted', 'won', 'lost');
CREATE TYPE vegetation_density AS ENUM ('light', 'moderate', 'heavy', 'very_heavy');
CREATE TYPE slope_difficulty AS ENUM ('flat', 'slight', 'moderate', 'steep');
CREATE TYPE access_difficulty AS ENUM ('easy', 'moderate', 'difficult');
CREATE TYPE timeline_preference AS ENUM ('asap', 'within_month', 'within_quarter', 'flexible');
CREATE TYPE budget_range AS ENUM ('under_5k', '5k_15k', '15k_30k', '30k_50k', 'over_50k');
CREATE TYPE user_role AS ENUM ('admin', 'sales', 'crew_leader', 'crew_member');
CREATE TYPE proposal_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired');
CREATE TYPE project_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled');

-- Users table for team management
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Profile
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'crew_member',
    
    -- Permissions
    can_view_leads BOOLEAN DEFAULT FALSE,
    can_edit_leads BOOLEAN DEFAULT FALSE,
    can_create_proposals BOOLEAN DEFAULT FALSE,
    can_access_admin BOOLEAN DEFAULT FALSE,
    
    -- Contact
    phone TEXT,
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Firebase sync
    firebase_uid TEXT UNIQUE,
    firebase_synced BOOLEAN DEFAULT FALSE
);

-- Leads table for capturing and managing potential customers
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Contact Information
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    
    -- Property Details
    property_address TEXT NOT NULL,
    property_city TEXT NOT NULL,
    property_state TEXT DEFAULT 'FL',
    property_zip TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Project Details
    acreage DECIMAL(10, 2) NOT NULL,
    vegetation_density vegetation_density NOT NULL,
    slope_difficulty slope_difficulty NOT NULL,
    access_difficulty access_difficulty NOT NULL,
    timeline timeline_preference NOT NULL,
    budget_range budget_range NOT NULL,
    
    -- Services (stored as array of strings)
    services_requested TEXT[] DEFAULT '{}',
    additional_notes TEXT,
    
    -- Lead Scoring and Status
    lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    lead_temperature lead_temperature DEFAULT 'cold',
    status lead_status DEFAULT 'new',
    
    -- Assignment and Follow-up
    assigned_to UUID REFERENCES users(id),
    next_follow_up TIMESTAMP WITH TIME ZONE,
    
    -- Source tracking
    source TEXT NOT NULL,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referrer_url TEXT,
    
    -- Attachments (URLs to photos)
    photo_urls TEXT[] DEFAULT '{}',
    
    -- Integration flags
    firebase_synced BOOLEAN DEFAULT FALSE,
    firebase_lead_id TEXT,
    
    -- Indexing for performance
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^[\+]?[\d\s\-\(\)]{10,}$')
);

-- Proposals table for storing quotes and estimates
CREATE TABLE IF NOT EXISTS proposals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Proposal Details
    proposal_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    
    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 4) DEFAULT 0.07, -- 7% Florida sales tax
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    deposit_amount DECIMAL(10, 2) DEFAULT 0,
    
    -- Line Items (stored as JSONB for flexibility)
    line_items JSONB DEFAULT '[]',
    
    -- Timeline
    estimated_start_date DATE,
    estimated_completion_date DATE,
    valid_until DATE NOT NULL,
    
    -- Status and tracking
    status proposal_status DEFAULT 'draft',
    sent_at TIMESTAMP WITH TIME ZONE,
    viewed_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- PDF and sharing
    pdf_url TEXT,
    public_url TEXT UNIQUE,
    
    -- Integration
    firebase_synced BOOLEAN DEFAULT FALSE,
    firebase_proposal_id TEXT,
    
    CONSTRAINT valid_amounts CHECK (subtotal >= 0 AND total_amount >= 0 AND deposit_amount >= 0),
    CONSTRAINT valid_dates CHECK (valid_until > created_at::date)
);

-- Projects table for tracking work execution
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Project basics
    name TEXT NOT NULL,
    description TEXT,
    status project_status DEFAULT 'planned',
    
    -- Relationships
    lead_id UUID REFERENCES leads(id),
    proposal_id UUID REFERENCES proposals(id),
    assigned_crew UUID[] DEFAULT '{}', -- Array of user IDs
    
    -- Location
    property_address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Timeline
    scheduled_start_date DATE,
    actual_start_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    
    -- Documentation (URLs to photos)
    before_photos TEXT[] DEFAULT '{}',
    progress_photos TEXT[] DEFAULT '{}',
    after_photos TEXT[] DEFAULT '{}',
    
    -- Equipment and resources
    equipment_used TEXT[] DEFAULT '{}',
    crew_hours DECIMAL(8, 2) DEFAULT 0,
    materials_used JSONB DEFAULT '{}',
    
    -- Financial
    project_value DECIMAL(10, 2) NOT NULL DEFAULT 0,
    actual_cost DECIMAL(10, 2),
    profit_margin DECIMAL(5, 2),
    
    -- Integration
    firebase_synced BOOLEAN DEFAULT FALSE,
    firebase_project_id TEXT,
    
    CONSTRAINT valid_financial CHECK (project_value >= 0 AND (actual_cost IS NULL OR actual_cost >= 0))
);

-- Equipment tracking table
CREATE TABLE IF NOT EXISTS equipment (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'mulcher', 'excavator', 'truck', etc.
    model TEXT,
    year INTEGER,
    serial_number TEXT UNIQUE,
    
    -- Status and availability
    status TEXT DEFAULT 'available', -- 'available', 'in_use', 'maintenance', 'out_of_service'
    current_location TEXT,
    
    -- Maintenance tracking
    last_maintenance_date DATE,
    next_maintenance_due DATE,
    maintenance_hours INTEGER DEFAULT 0,
    total_hours INTEGER DEFAULT 0,
    
    -- Financial
    purchase_price DECIMAL(10, 2),
    current_value DECIMAL(10, 2),
    hourly_rate DECIMAL(6, 2), -- Rate for project costing
    
    -- Documentation
    photos TEXT[] DEFAULT '{}',
    documents TEXT[] DEFAULT '{}', -- URLs to manuals, warranties, etc.
    
    firebase_synced BOOLEAN DEFAULT FALSE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_temperature ON leads(lead_temperature);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_location ON leads(property_city, property_state);

CREATE INDEX IF NOT EXISTS idx_proposals_lead_id ON proposals(lead_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(scheduled_start_date, estimated_completion_date);
CREATE INDEX IF NOT EXISTS idx_projects_lead_id ON projects(lead_id);
CREATE INDEX IF NOT EXISTS idx_projects_proposal_id ON projects(proposal_id);

CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(type);

-- Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be customized based on business rules)
-- Allow authenticated users to read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = firebase_uid);

CREATE POLICY "Admin users can view all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE firebase_uid = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Leads policies
CREATE POLICY "Users can view assigned leads" ON leads
    FOR SELECT USING (
        assigned_to IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE firebase_uid = auth.uid()::text 
            AND (role = 'admin' OR can_view_leads = true)
        )
    );

-- Proposals policies  
CREATE POLICY "Users can view proposals for their leads" ON proposals
    FOR SELECT USING (
        lead_id IN (
            SELECT l.id FROM leads l
            JOIN users u ON l.assigned_to = u.id
            WHERE u.firebase_uid = auth.uid()::text
        )
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE firebase_uid = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Projects policies
CREATE POLICY "Users can view assigned projects" ON projects
    FOR SELECT USING (
        auth.uid()::text = ANY(
            SELECT u.firebase_uid FROM users u 
            WHERE u.id = ANY(assigned_crew)
        )
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE firebase_uid = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Equipment policies
CREATE POLICY "Authenticated users can view equipment" ON equipment
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create views for common queries
CREATE OR REPLACE VIEW lead_summary AS
SELECT 
    l.*,
    u.name as assigned_user_name,
    COUNT(p.id) as proposal_count,
    MAX(p.created_at) as latest_proposal_date,
    CASE 
        WHEN l.lead_score >= 80 THEN 'High Priority'
        WHEN l.lead_score >= 60 THEN 'Medium Priority'
        ELSE 'Low Priority'
    END as priority_label
FROM leads l
LEFT JOIN users u ON l.assigned_to = u.id
LEFT JOIN proposals p ON l.id = p.lead_id
GROUP BY l.id, u.name;

CREATE OR REPLACE VIEW project_dashboard AS
SELECT 
    p.*,
    l.name as customer_name,
    l.email as customer_email,
    l.phone as customer_phone,
    ARRAY_AGG(u.name) as crew_names,
    CASE 
        WHEN p.actual_completion_date IS NOT NULL THEN 'Completed'
        WHEN p.actual_start_date IS NOT NULL THEN 'In Progress'
        WHEN p.scheduled_start_date <= CURRENT_DATE THEN 'Ready to Start'
        ELSE 'Scheduled'
    END as project_stage
FROM projects p
LEFT JOIN leads l ON p.lead_id = l.id
LEFT JOIN users u ON u.id = ANY(p.assigned_crew)
GROUP BY p.id, l.name, l.email, l.phone;

-- Analytics views
CREATE OR REPLACE VIEW monthly_lead_analytics AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_leads,
    COUNT(CASE WHEN lead_temperature = 'hot' THEN 1 END) as hot_leads,
    COUNT(CASE WHEN lead_temperature = 'warm' THEN 1 END) as warm_leads,
    COUNT(CASE WHEN lead_temperature = 'cold' THEN 1 END) as cold_leads,
    COUNT(CASE WHEN status = 'won' THEN 1 END) as converted_leads,
    ROUND(AVG(lead_score), 2) as avg_lead_score,
    ROUND(
        COUNT(CASE WHEN status = 'won' THEN 1 END)::DECIMAL / 
        NULLIF(COUNT(*), 0) * 100, 
        2
    ) as conversion_rate
FROM leads
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Function to calculate lead score based on business rules
CREATE OR REPLACE FUNCTION calculate_lead_score(
    p_acreage DECIMAL,
    p_vegetation_density vegetation_density,
    p_timeline timeline_preference,
    p_budget_range budget_range,
    p_services_count INTEGER
) RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Base score for engagement (submitting estimate request)
    score := score + 20;
    
    -- Acreage scoring (larger projects typically more valuable)
    IF p_acreage >= 5 THEN score := score + 20;
    ELSIF p_acreage >= 2 THEN score := score + 15;
    ELSIF p_acreage >= 1 THEN score := score + 10;
    ELSE score := score + 5;
    END IF;
    
    -- Vegetation density (more work = higher value)
    CASE p_vegetation_density
        WHEN 'very_heavy' THEN score := score + 20;
        WHEN 'heavy' THEN score := score + 15;
        WHEN 'moderate' THEN score := score + 10;
        WHEN 'light' THEN score := score + 5;
    END CASE;
    
    -- Timeline urgency
    CASE p_timeline
        WHEN 'asap' THEN score := score + 20;
        WHEN 'within_month' THEN score := score + 15;
        WHEN 'within_quarter' THEN score := score + 10;
        WHEN 'flexible' THEN score := score + 5;
    END CASE;
    
    -- Budget range
    CASE p_budget_range
        WHEN 'over_50k' THEN score := score + 20;
        WHEN '30k_50k' THEN score := score + 15;
        WHEN '15k_30k' THEN score := score + 10;
        WHEN '5k_15k' THEN score := score + 8;
        WHEN 'under_5k' THEN score := score + 5;
    END CASE;
    
    -- Multiple services bonus
    IF p_services_count > 1 THEN
        score := score + (p_services_count - 1) * 3;
    END IF;
    
    -- Ensure score is within bounds
    RETURN GREATEST(0, LEAST(100, score));
END;
$$ LANGUAGE plpgsql;

-- Function to auto-assign lead temperature based on score
CREATE OR REPLACE FUNCTION assign_lead_temperature(lead_score INTEGER) 
RETURNS lead_temperature AS $$
BEGIN
    IF lead_score >= 80 THEN
        RETURN 'hot';
    ELSIF lead_score >= 60 THEN
        RETURN 'warm';
    ELSE
        RETURN 'cold';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate lead score and temperature
CREATE OR REPLACE FUNCTION auto_score_lead()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate lead score
    NEW.lead_score := calculate_lead_score(
        NEW.acreage,
        NEW.vegetation_density,
        NEW.timeline,
        NEW.budget_range,
        COALESCE(array_length(NEW.services_requested, 1), 0)
    );
    
    -- Assign temperature based on score
    NEW.lead_temperature := assign_lead_temperature(NEW.lead_score);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_score_leads_trigger
    BEFORE INSERT OR UPDATE OF acreage, vegetation_density, timeline, budget_range, services_requested ON leads
    FOR EACH ROW EXECUTE FUNCTION auto_score_lead();

-- Insert some sample data for testing (optional)
-- Uncomment the following to add test data

/*
-- Sample admin user
INSERT INTO users (email, name, role, can_view_leads, can_edit_leads, can_create_proposals, can_access_admin, firebase_uid)
VALUES ('admin@fltreeshop.com', 'Admin User', 'admin', true, true, true, true, 'admin-firebase-uid');

-- Sample sales user  
INSERT INTO users (email, name, role, can_view_leads, can_edit_leads, can_create_proposals, firebase_uid)
VALUES ('sales@fltreeshop.com', 'Sales Rep', 'sales', true, true, true, 'sales-firebase-uid');

-- Sample equipment
INSERT INTO equipment (name, type, model, year, status, hourly_rate)
VALUES 
    ('CAT 299D3 with Forestry Mulcher', 'mulcher', '299D3', 2023, 'available', 275.00),
    ('CAT 262D3 Skid Steer', 'skid_steer', '262D3', 2022, 'available', 125.00),
    ('Ford F-550 Dump Truck', 'truck', 'F-550', 2021, 'available', 85.00);
*/

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Tree Shop Supabase schema created successfully!' as status;