/**
 * AgentOs Core Orchestration Framework
 * 
 * This is the central nervous system of the TreeAI Hive Intelligence ecosystem.
 * It provides multi-agent coordination, swarm intelligence, and democratic
 * decision-making across all 8 specialized domains.
 * 
 * @version 2.0.0
 * @domain Domain 2: AgentOs Orchestration
 */

export interface Agent {
  id: string;
  domain: TreeAIDomain;
  name: string;
  capabilities: string[];
  status: AgentStatus;
  priority: number;
  lastActive: Date;
  healthScore: number;
}

export interface Task {
  id: string;
  type: TaskType;
  priority: TaskPriority;
  description: string;
  requiredDomains: TreeAIDomain[];
  assignedAgents: string[];
  status: TaskStatus;
  createdAt: Date;
  deadline?: Date;
  dependencies: string[];
  results?: any;
}

export interface SwarmDecision {
  id: string;
  question: string;
  proposedBy: string;
  votes: Record<string, 'approve' | 'reject' | 'abstain'>;
  consensus: 'pending' | 'approved' | 'rejected';
  executionPlan?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export enum TreeAIDomain {
  CORE_INTELLIGENCE = 'core-intelligence',
  AGENTOS_ORCHESTRATION = 'agentos-orchestration',
  IOS_NATIVE = 'ios-native',
  SAAS_PLATFORM = 'saas-platform',
  DATA_INTELLIGENCE = 'data-intelligence',
  SECURITY_INTELLIGENCE = 'security-intelligence',
  DEVOPS_INTELLIGENCE = 'devops-intelligence',
  BUSINESS_INTELLIGENCE = 'business-intelligence'
}

export enum AgentStatus {
  ACTIVE = 'active',
  IDLE = 'idle',
  BUSY = 'busy',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance'
}

export enum TaskType {
  COORDINATION = 'coordination',
  EXECUTION = 'execution',
  ANALYSIS = 'analysis',
  DECISION = 'decision',
  MONITORING = 'monitoring'
}

export enum TaskPriority {
  CRITICAL = 1,
  HIGH = 2,
  MEDIUM = 3,
  LOW = 4
}

export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * AgentOs Core Orchestration Engine
 * 
 * Manages the entire hive intelligence ecosystem with democratic
 * decision-making and swarm coordination patterns.
 */
export class AgentOsCore {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private decisions: Map<string, SwarmDecision> = new Map();
  private communicationBus: Map<string, any[]> = new Map();

  constructor() {
    this.initializeCore();
  }

  /**
   * Initialize the AgentOs Core system
   */
  private initializeCore(): void {
    // Initialize communication bus for all domains
    Object.values(TreeAIDomain).forEach(domain => {
      this.communicationBus.set(domain, []);
    });

    console.log('🤖 AgentOs Core initialized - Hive intelligence activated');
  }

  /**
   * Register a new agent in the hive
   */
  registerAgent(agent: Agent): void {
    this.agents.set(agent.id, {
      ...agent,
      lastActive: new Date(),
      healthScore: 100
    });

    this.broadcastMessage(agent.domain, {
      type: 'AGENT_REGISTERED',
      agentId: agent.id,
      domain: agent.domain,
      timestamp: new Date()
    });

    console.log(`🐝 Agent ${agent.name} registered in ${agent.domain} domain`);
  }

  /**
   * Submit a new task to the hive for democratic assignment
   */
  submitTask(task: Omit<Task, 'id' | 'assignedAgents' | 'status' | 'createdAt'>): string {
    const taskId = this.generateId();
    const newTask: Task = {
      ...task,
      id: taskId,
      assignedAgents: [],
      status: TaskStatus.PENDING,
      createdAt: new Date()
    };

    this.tasks.set(taskId, newTask);
    this.coordinateTaskAssignment(taskId);

    return taskId;
  }

  /**
   * Coordinate democratic task assignment across the hive
   */
  private coordinateTaskAssignment(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    // Find capable agents across required domains
    const capableAgents = Array.from(this.agents.values())
      .filter(agent => 
        task.requiredDomains.includes(agent.domain) &&
        agent.status === AgentStatus.ACTIVE &&
        agent.healthScore > 70
      )
      .sort((a, b) => b.healthScore - a.healthScore);

    // Democratic assignment based on capability and availability
    const optimalAgents = this.selectOptimalAgents(capableAgents, task);
    
    task.assignedAgents = optimalAgents.map(agent => agent.id);
    task.status = TaskStatus.ASSIGNED;
    
    this.tasks.set(taskId, task);

    // Notify assigned agents
    optimalAgents.forEach(agent => {
      this.broadcastMessage(agent.domain, {
        type: 'TASK_ASSIGNED',
        taskId,
        agentId: agent.id,
        task,
        timestamp: new Date()
      });
    });

    console.log(`📋 Task ${taskId} assigned to ${optimalAgents.length} agents across domains`);
  }

  /**
   * Select optimal agents using swarm intelligence algorithms
   */
  private selectOptimalAgents(candidates: Agent[], task: Task): Agent[] {
    // Swarm intelligence: balance workload, expertise, and domain coverage
    const domainCoverage = new Map<TreeAIDomain, Agent[]>();
    
    // Group candidates by domain
    candidates.forEach(agent => {
      if (!domainCoverage.has(agent.domain)) {
        domainCoverage.set(agent.domain, []);
      }
      domainCoverage.get(agent.domain)!.push(agent);
    });

    // Select best agent from each required domain
    const selected: Agent[] = [];
    task.requiredDomains.forEach(domain => {
      const domainAgents = domainCoverage.get(domain) || [];
      if (domainAgents.length > 0) {
        // Select based on health score and current workload
        const best = domainAgents.reduce((best, current) => 
          current.healthScore > best.healthScore ? current : best
        );
        selected.push(best);
      }
    });

    return selected;
  }

  /**
   * Propose a decision to the hive for democratic voting
   */
  proposeDecision(question: string, proposedBy: string, executionPlan?: string): string {
    const decisionId = this.generateId();
    const decision: SwarmDecision = {
      id: decisionId,
      question,
      proposedBy,
      votes: {},
      consensus: 'pending',
      executionPlan,
      createdAt: new Date()
    };

    this.decisions.set(decisionId, decision);

    // Broadcast to all active agents for voting
    this.broadcastToAllDomains({
      type: 'DECISION_PROPOSED',
      decisionId,
      decision,
      timestamp: new Date()
    });

    console.log(`🗳️ Decision ${decisionId} proposed to the hive: "${question}"`);
    return decisionId;
  }

  /**
   * Cast a vote on a pending decision
   */
  castVote(decisionId: string, agentId: string, vote: 'approve' | 'reject' | 'abstain'): void {
    const decision = this.decisions.get(decisionId);
    if (!decision || decision.consensus !== 'pending') return;

    decision.votes[agentId] = vote;
    this.evaluateConsensus(decisionId);
  }

  /**
   * Evaluate consensus using democratic algorithms
   */
  private evaluateConsensus(decisionId: string): void {
    const decision = this.decisions.get(decisionId);
    if (!decision) return;

    const votes = Object.values(decision.votes);
    const totalVotes = votes.length;
    const approveVotes = votes.filter(v => v === 'approve').length;
    const rejectVotes = votes.filter(v => v === 'reject').length;

    // Require majority approval and minimum participation
    const activeAgents = Array.from(this.agents.values()).filter(a => a.status === AgentStatus.ACTIVE).length;
    const participationRate = totalVotes / activeAgents;

    if (participationRate >= 0.6) { // 60% minimum participation
      if (approveVotes > rejectVotes && approveVotes / totalVotes >= 0.6) {
        decision.consensus = 'approved';
        decision.resolvedAt = new Date();
        this.executeDecision(decisionId);
      } else if (rejectVotes >= approveVotes) {
        decision.consensus = 'rejected';
        decision.resolvedAt = new Date();
      }

      this.decisions.set(decisionId, decision);
      this.broadcastDecisionResult(decisionId);
    }
  }

  /**
   * Execute an approved decision
   */
  private executeDecision(decisionId: string): void {
    const decision = this.decisions.get(decisionId);
    if (!decision || decision.consensus !== 'approved') return;

    // If execution plan exists, create implementation task
    if (decision.executionPlan) {
      this.submitTask({
        type: TaskType.EXECUTION,
        priority: TaskPriority.HIGH,
        description: `Execute approved decision: ${decision.question}`,
        requiredDomains: [TreeAIDomain.AGENTOS_ORCHESTRATION], // Can be expanded based on decision
        dependencies: []
      });
    }

    console.log(`✅ Decision ${decisionId} approved and execution initiated`);
  }

  /**
   * Broadcast message to all agents in a specific domain
   */
  private broadcastMessage(domain: TreeAIDomain, message: any): void {
    const domainMessages = this.communicationBus.get(domain) || [];
    domainMessages.push({
      ...message,
      id: this.generateId(),
      domain,
      broadcast: true
    });
    this.communicationBus.set(domain, domainMessages);
  }

  /**
   * Broadcast message to all domains
   */
  private broadcastToAllDomains(message: any): void {
    Object.values(TreeAIDomain).forEach(domain => {
      this.broadcastMessage(domain, message);
    });
  }

  /**
   * Broadcast decision result to all domains
   */
  private broadcastDecisionResult(decisionId: string): void {
    const decision = this.decisions.get(decisionId);
    if (!decision) return;

    this.broadcastToAllDomains({
      type: 'DECISION_RESOLVED',
      decisionId,
      consensus: decision.consensus,
      question: decision.question,
      timestamp: new Date()
    });
  }

  /**
   * Get real-time hive status across all domains
   */
  getHiveStatus() {
    const domainStats = new Map<TreeAIDomain, any>();
    
    Object.values(TreeAIDomain).forEach(domain => {
      const domainAgents = Array.from(this.agents.values()).filter(a => a.domain === domain);
      const domainTasks = Array.from(this.tasks.values()).filter(t => t.requiredDomains.includes(domain));
      
      domainStats.set(domain, {
        agentCount: domainAgents.length,
        activeAgents: domainAgents.filter(a => a.status === AgentStatus.ACTIVE).length,
        avgHealthScore: domainAgents.reduce((sum, a) => sum + a.healthScore, 0) / domainAgents.length || 0,
        pendingTasks: domainTasks.filter(t => t.status === TaskStatus.PENDING).length,
        activeTasks: domainTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length
      });
    });

    return {
      totalAgents: this.agents.size,
      totalTasks: this.tasks.size,
      pendingDecisions: Array.from(this.decisions.values()).filter(d => d.consensus === 'pending').length,
      domainStats: Object.fromEntries(domainStats),
      lastUpdate: new Date()
    };
  }

  /**
   * Generate unique ID for system entities
   */
  private generateId(): string {
    return `hive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Global AgentOs Core instance - Singleton pattern for hive coordination
 */
export const agentOsCore = new AgentOsCore();

/**
 * Utility function to register domain agents
 */
export function registerDomainAgent(domain: TreeAIDomain, name: string, capabilities: string[]): string {
  const agent: Agent = {
    id: `${domain}_${Date.now()}`,
    domain,
    name,
    capabilities,
    status: AgentStatus.ACTIVE,
    priority: 1,
    lastActive: new Date(),
    healthScore: 100
  };

  agentOsCore.registerAgent(agent);
  return agent.id;
}

/**
 * Utility function for cross-domain task coordination
 */
export function coordinateTask(
  description: string, 
  requiredDomains: TreeAIDomain[], 
  priority: TaskPriority = TaskPriority.MEDIUM
): string {
  return agentOsCore.submitTask({
    type: TaskType.COORDINATION,
    priority,
    description,
    requiredDomains,
    dependencies: []
  });
}

export default agentOsCore;