// Enhanced Location Service for TreeShop - TreeAI Hive Intelligence Integration
// Domain Coordination: TreeAI Core + SaaS Platform + Data Intelligence + Business Intelligence + Security Intelligence

import { GooglePlacesManager, GeocodeResult, PlacesCache } from '@/lib/googlePlaces';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

// TreeAI Core Intelligence - Advanced Pricing Algorithm Integration
export interface TreeAIPricingFactors {
  basePropertyType: 'residential' | 'commercial' | 'agricultural' | 'industrial';
  vegetationDensity: 'light' | 'moderate' | 'heavy' | 'extreme';
  terrainDifficulty: number; // 1-10 scale
  equipmentAccessibility: number; // 1-10 scale
  proximityToUtilities: boolean;
  environmentalRestrictions: string[];
  seasonalFactors: {
    wetlandSeason: boolean;
    birdNestingSeason: boolean;
    fireRiskLevel: 'low' | 'moderate' | 'high';
  };
}

// Business Intelligence - Enhanced Location Analytics
export interface LocationAnalytics {
  marketSegment: 'premium' | 'standard' | 'budget';
  competitorDensity: number;
  historicalDemand: 'low' | 'moderate' | 'high';
  customerRetentionProbability: number;
  priceElasticity: number;
  averageProjectSize: number;
}

// Security Intelligence - Risk Assessment
export interface LocationRiskProfile {
  accessRisk: 'low' | 'moderate' | 'high';
  equipmentSecurityRisk: 'low' | 'moderate' | 'high';
  weatherVulnerability: number; // 1-10 scale
  liabilityFactors: string[];
  insuranceComplexity: 'standard' | 'complex';
}

export interface PropertyLocation {
  placeId: string;
  address: string;
  coordinates: LocationCoordinates;
  components: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    county?: string;
    country?: string;
  };
  verified: boolean;
  propertyType?: 'residential' | 'commercial' | 'agricultural' | 'industrial';
  accessibilityScore?: number; // 1-10 based on equipment access
  distanceFromBase: {
    meters: number;
    durationSeconds: number;
    drivingRoute?: google.maps.DirectionsRoute;
  };
  
  // TreeAI Enhanced Intelligence
  treeAIAnalysis?: {
    pricingFactors: TreeAIPricingFactors;
    estimatedCost: {
      basePrice: number;
      travelSurcharge: number;
      difficultyMultiplier: number;
      totalEstimate: number;
      confidence: number; // 0-1 scale
    };
  };
  
  // Business Intelligence
  analytics?: LocationAnalytics;
  
  // Security Intelligence
  riskProfile?: LocationRiskProfile;
  
  // Data Intelligence - Enhanced Property Insights
  propertyInsights?: {
    lotSize: number; // square feet
    buildingCount: number;
    vegetationCoverage: number; // percentage
    slopeAnalysis: {
      averageSlope: number;
      maxSlope: number;
      terrainType: 'flat' | 'rolling' | 'steep' | 'mountainous';
    };
    waterFeatures: string[];
    utilityClearanceNeeds: boolean;
  };
}

export interface ServiceArea {
  center: LocationCoordinates;
  radiusKm: number;
  surchargeZones: Array<{
    minDistance: number;
    maxDistance: number;
    surchargePercent: number;
    description: string;
  }>;
}

export interface PreciseLocationRequest {
  coordinates: LocationCoordinates;
  address?: string;
  propertyBounds?: google.maps.LatLngBoundsLiteral;
  notes?: string;
}

export class LocationService extends GooglePlacesManager {
  private static instance: LocationService;
  private serviceAreas: ServiceArea[];
  private baseLocation: LocationCoordinates;
  
  constructor(apiKey: string) {
    super(apiKey);
    
    // TreeShop base location - 3634 Watermelon Lane, New Smyrna Beach, FL 32168
    this.baseLocation = { lat: 29.0216, lng: -81.0770 };
    
    // Define service areas with enhanced surcharge zones for TreeAI intelligence
    this.serviceAreas = [
      {
        center: this.baseLocation,
        radiusKm: 150,
        surchargeZones: [
          { minDistance: 0, maxDistance: 30, surchargePercent: 0, description: 'Core Service Area - Premium Response' },
          { minDistance: 30, maxDistance: 60, surchargePercent: 5, description: 'Primary Service Area - Standard' },
          { minDistance: 60, maxDistance: 100, surchargePercent: 15, description: 'Extended Service Area - Travel Premium' },
          { minDistance: 100, maxDistance: 150, surchargePercent: 25, description: 'Maximum Service Area - High Travel Cost' },
        ]
      }
    ];
  }

  static getInstance(apiKey?: string): LocationService {
    if (!LocationService.instance) {
      if (!apiKey) {
        throw new Error('API key required to initialize LocationService');
      }
      LocationService.instance = new LocationService(apiKey);
    }
    return LocationService.instance;
  }

  // Enhanced address verification with TreeAI property type detection
  async verifyPropertyLocation(address: string): Promise<PropertyLocation> {
    const cacheKey = `property_location_${address.toLowerCase().trim()}`;
    const cached = PlacesCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // First, use address validation API for precision
      const validation = await this.validateAddress(address);
      
      if (validation.verdict === 'INVALID') {
        throw new Error(`Address validation failed: ${address}`);
      }

      // Get detailed geocoding information
      const places = await this.searchPlaces(validation.normalizedAddress || address);
      if (!places.length) {
        throw new Error('No matching places found');
      }

      const bestMatch = places[0];
      const geocode = await this.geocodePlaceId(bestMatch.place_id);
      
      // Calculate distance and route from base
      const distanceInfo = await this.calculateDistanceFromBase(bestMatch.place_id);
      
      // Detect property type based on Google Places types
      const propertyType = this.detectPropertyType(bestMatch.types || []);
      
      // Calculate accessibility score and TreeAI analysis
      const accessibilityScore = await this.calculateAccessibilityScore(geocode.lat, geocode.lng);
      
      // Perform TreeAI intelligent analysis
      const treeAIAnalysis = await this.performTreeAIAnalysis(geocode, propertyType, distanceInfo);
      
      // Generate business intelligence insights
      const analytics = await this.generateLocationAnalytics(geocode);
      
      // Assess security and risk profile
      const riskProfile = await this.assessLocationRisk(geocode, accessibilityScore);
      
      // Generate property insights
      const propertyInsights = await this.generatePropertyInsights(geocode.lat, geocode.lng);

      const propertyLocation: PropertyLocation = {
        placeId: bestMatch.place_id,
        address: geocode.formattedAddress,
        coordinates: { lat: geocode.lat, lng: geocode.lng },
        components: geocode.components,
        verified: validation.verdict === 'VALID',
        propertyType,
        accessibilityScore,
        distanceFromBase: distanceInfo,
        treeAIAnalysis,
        analytics,
        riskProfile,
        propertyInsights,
      };

      // Cache for 24 hours
      PlacesCache.set(cacheKey, propertyLocation);
      
      return propertyLocation;
    } catch (error) {
      console.error('Property location verification failed:', error);
      throw new Error(`Could not verify property location: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Process precise coordinates from pin drop with TreeAI intelligence
  async processPinDropLocation(request: PreciseLocationRequest): Promise<PropertyLocation> {
    const { coordinates, address, propertyBounds, notes } = request;
    
    try {
      // Reverse geocode the coordinates to get address
      const reverseGeocode = await this.reverseGeocode(coordinates.lat, coordinates.lng);
      
      // Use provided address or reverse geocoded address
      const finalAddress = address || reverseGeocode.formattedAddress;
      
      // Validate the derived address
      const validation = await this.validateAddress(finalAddress);
      
      // Calculate distance from base
      const distanceInfo = await this.calculateDistanceFromCoordinates(coordinates);
      
      // Calculate accessibility score
      const accessibilityScore = await this.calculateAccessibilityScore(
        coordinates.lat, 
        coordinates.lng,
        propertyBounds
      );
      
      // Perform TreeAI intelligent analysis for pin drop
      const propertyType = this.detectPropertyType(reverseGeocode.types || []);
      const treeAIAnalysis = await this.performTreeAIAnalysis(
        { lat: coordinates.lat, lng: coordinates.lng, components: reverseGeocode.components } as any,
        propertyType,
        distanceInfo
      );
      
      // Generate analytics and risk assessment
      const analytics = await this.generateLocationAnalytics({ lat: coordinates.lat, lng: coordinates.lng } as any);
      const riskProfile = await this.assessLocationRisk({ lat: coordinates.lat, lng: coordinates.lng } as any, accessibilityScore);
      const propertyInsights = await this.generatePropertyInsights(coordinates.lat, coordinates.lng, propertyBounds);

      const propertyLocation: PropertyLocation = {
        placeId: reverseGeocode.placeId,
        address: finalAddress,
        coordinates,
        components: reverseGeocode.components,
        verified: validation.verdict !== 'INVALID',
        propertyType,
        accessibilityScore,
        distanceFromBase: distanceInfo,
        treeAIAnalysis,
        analytics,
        riskProfile,
        propertyInsights,
      };

      return propertyLocation;
    } catch (error) {
      console.error('Pin drop location processing failed:', error);
      throw new Error(`Could not process pin drop location: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // TreeShop Transportation Cost Calculation - $350/hour model
  calculateTransportationCost(travelTimeMinutes: number): {
    oneWayTravelTime: number;
    roundTripTravelTime: number;
    transportationCost: number;
    costBreakdown: {
      hourlyRate: number;
      totalHours: number;
      description: string;
    };
  } {
    const oneWayTravelTime = travelTimeMinutes;
    const roundTripTravelTime = travelTimeMinutes * 2;
    const totalHoursRounded = Math.ceil(roundTripTravelTime / 60);
    const transportationCost = totalHoursRounded * 350;

    return {
      oneWayTravelTime,
      roundTripTravelTime,
      transportationCost,
      costBreakdown: {
        hourlyRate: 350,
        totalHours: totalHoursRounded,
        description: `${Math.ceil(oneWayTravelTime / 60)}h each way = ${totalHoursRounded}h total @ $350/hr`
      }
    };
  }

  // TreeAI Enhanced Travel Surcharge with Intelligence Factors
  calculateTravelSurcharge(distanceMeters: number, basePrice: number, riskProfile?: LocationRiskProfile): {
    surchargePercent: number;
    surchargeAmount: number;
    zone: string;
    riskAdjustment: number;
    finalSurcharge: number;
  } {
    const distanceKm = distanceMeters / 1000;
    
    for (const serviceArea of this.serviceAreas) {
      for (const zone of serviceArea.surchargeZones) {
        if (distanceKm >= zone.minDistance && distanceKm < zone.maxDistance) {
          // Apply TreeAI risk intelligence adjustments
          let riskAdjustment = 0;
          if (riskProfile) {
            if (riskProfile.accessRisk === 'high') riskAdjustment += 5;
            if (riskProfile.equipmentSecurityRisk === 'high') riskAdjustment += 3;
            if (riskProfile.weatherVulnerability > 7) riskAdjustment += 2;
          }
          
          const baseSurcharge = zone.surchargePercent + riskAdjustment;
          const surchargeAmount = basePrice * (baseSurcharge / 100);
          
          return {
            surchargePercent: zone.surchargePercent,
            surchargeAmount: basePrice * (zone.surchargePercent / 100),
            zone: zone.description,
            riskAdjustment,
            finalSurcharge: surchargeAmount,
          };
        }
      }
    }

    // Beyond service area with higher risk premium
    const riskAdjustment = riskProfile?.accessRisk === 'high' ? 10 : 0;
    const baseSurcharge = 30 + riskAdjustment;
    
    return {
      surchargePercent: 30,
      surchargeAmount: basePrice * 0.3,
      zone: 'Outside Service Area',
      riskAdjustment,
      finalSurcharge: basePrice * (baseSurcharge / 100),
    };
  }

  // Check if location is within service area
  isWithinServiceArea(coordinates: LocationCoordinates): boolean {
    const distance = this.calculateDistanceKm(this.baseLocation, coordinates);
    return distance <= Math.max(...this.serviceAreas.map(area => area.radiusKm));
  }

  // TreeAI Core Intelligence - Advanced Property Analysis
  private async performTreeAIAnalysis(
    geocodeData: any,
    propertyType: PropertyLocation['propertyType'],
    distanceInfo: PropertyLocation['distanceFromBase']
  ): Promise<PropertyLocation['treeAIAnalysis']> {
    try {
      // Analyze vegetation density using satellite imagery insights
      const vegetationDensity = await this.analyzeVegetationDensity(geocodeData.lat, geocodeData.lng);
      
      // Calculate terrain difficulty
      const terrainDifficulty = await this.calculateTerrainDifficulty(geocodeData.lat, geocodeData.lng);
      
      // Assess equipment accessibility
      const equipmentAccessibility = await this.assessEquipmentAccess(geocodeData);
      
      const pricingFactors: TreeAIPricingFactors = {
        basePropertyType: propertyType || 'residential',
        vegetationDensity,
        terrainDifficulty,
        equipmentAccessibility,
        proximityToUtilities: await this.checkUtilityProximity(geocodeData.lat, geocodeData.lng),
        environmentalRestrictions: await this.getEnvironmentalRestrictions(geocodeData.components),
        seasonalFactors: {
          wetlandSeason: this.isWetlandSeason(),
          birdNestingSeason: this.isBirdNestingSeason(),
          fireRiskLevel: await this.assessFireRisk(geocodeData.lat, geocodeData.lng),
        },
      };
      
      // Calculate TreeAI pricing estimate
      const estimatedCost = this.calculateTreeAIPrice(pricingFactors, distanceInfo);
      
      return {
        pricingFactors,
        estimatedCost,
      };
    } catch (error) {
      console.error('TreeAI analysis failed:', error);
      return undefined;
    }
  }
  
  // Business Intelligence - Location Market Analysis
  private async generateLocationAnalytics(geocodeData: any): Promise<LocationAnalytics> {
    try {
      const zipCode = geocodeData.components?.zip;
      const city = geocodeData.components?.city;
      
      // Analyze market segment based on location characteristics
      const marketSegment = await this.determineMarketSegment(zipCode, city);
      
      // Estimate competitor density (placeholder - would integrate with business databases)
      const competitorDensity = await this.estimateCompetitorDensity(geocodeData.lat, geocodeData.lng);
      
      return {
        marketSegment,
        competitorDensity,
        historicalDemand: 'moderate', // Would integrate with historical data
        customerRetentionProbability: marketSegment === 'premium' ? 0.85 : 0.75,
        priceElasticity: marketSegment === 'premium' ? 0.3 : 0.6,
        averageProjectSize: marketSegment === 'premium' ? 3.5 : 2.2,
      };
    } catch (error) {
      console.error('Location analytics failed:', error);
      return {
        marketSegment: 'standard',
        competitorDensity: 0.5,
        historicalDemand: 'moderate',
        customerRetentionProbability: 0.75,
        priceElasticity: 0.5,
        averageProjectSize: 2.5,
      };
    }
  }
  
  // Security Intelligence - Risk Assessment
  private async assessLocationRisk(geocodeData: any, accessibilityScore: number): Promise<LocationRiskProfile> {
    try {
      const riskFactors = [];
      let accessRisk: 'low' | 'moderate' | 'high' = 'low';
      let equipmentSecurityRisk: 'low' | 'moderate' | 'high' = 'low';
      
      // Assess access risk based on road types and terrain
      if (accessibilityScore < 4) {
        accessRisk = 'high';
        riskFactors.push('Difficult equipment access');
      } else if (accessibilityScore < 7) {
        accessRisk = 'moderate';
      }
      
      // Assess equipment security based on location type
      const isRemote = await this.isRemoteLocation(geocodeData.lat, geocodeData.lng);
      if (isRemote) {
        equipmentSecurityRisk = 'moderate';
        riskFactors.push('Remote location equipment security');
      }
      
      return {
        accessRisk,
        equipmentSecurityRisk,
        weatherVulnerability: await this.assessWeatherRisk(geocodeData.lat, geocodeData.lng),
        liabilityFactors: riskFactors,
        insuranceComplexity: riskFactors.length > 2 ? 'complex' : 'standard',
      };
    } catch (error) {
      console.error('Risk assessment failed:', error);
      return {
        accessRisk: 'moderate',
        equipmentSecurityRisk: 'moderate',
        weatherVulnerability: 5,
        liabilityFactors: [],
        insuranceComplexity: 'standard',
      };
    }
  }
  
  // Enhanced Property Insights
  private async generatePropertyInsights(
    lat: number,
    lng: number,
    propertyBounds?: google.maps.LatLngBoundsLiteral
  ): Promise<PropertyLocation['propertyInsights']> {
    try {
      const lotSize = propertyBounds ? this.calculateBoundsArea(propertyBounds) : 10000; // Default estimate
      
      return {
        lotSize,
        buildingCount: await this.estimateBuildingCount(lat, lng),
        vegetationCoverage: await this.calculateVegetationCoverage(lat, lng),
        slopeAnalysis: await this.analyzeTerrain(lat, lng),
        waterFeatures: await this.identifyWaterFeatures(lat, lng),
        utilityClearanceNeeds: await this.checkUtilityClearance(lat, lng),
      };
    } catch (error) {
      console.error('Property insights generation failed:', error);
      return undefined;
    }
  }

  // Private helper methods
  private async searchPlaces(query: string): Promise<any[]> {
    // This would use the Places Text Search API
    const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    url.searchParams.set('query', query);
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('location', `${this.baseLocation.lat},${this.baseLocation.lng}`);
    url.searchParams.set('radius', '150000'); // 150km radius

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Places search failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status !== 'OK') {
      throw new Error(`Places search failed: ${data.status}`);
    }

    return data.results || [];
  }

  private async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult & { types?: string[] }> {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('latlng', `${lat},${lng}`);
    url.searchParams.set('key', this.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status !== 'OK' || !data.results?.length) {
      throw new Error(`Reverse geocoding failed: ${data.status}`);
    }

    const result = data.results[0];
    const location = result.geometry.location;
    
    // Parse address components (reuse logic from parent class)
    const components: GeocodeResult['components'] = {};
    for (const component of result.address_components || []) {
      const types = component.types;
      
      if (types.includes('street_number') || types.includes('route')) {
        if (!components.street) components.street = '';
        components.street += component.long_name + ' ';
      }
      if (types.includes('locality')) {
        components.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        components.state = component.short_name;
      }
      if (types.includes('postal_code')) {
        components.zip = component.long_name;
      }
      if (types.includes('administrative_area_level_2')) {
        components.county = component.long_name;
      }
      if (types.includes('country')) {
        components.country = component.short_name;
      }
    }
    
    if (components.street) {
      components.street = components.street.trim();
    }

    return {
      placeId: result.place_id,
      lat: location.lat,
      lng: location.lng,
      formattedAddress: result.formatted_address,
      components,
      types: result.types,
    };
  }

  private async calculateDistanceFromBase(placeId: string): Promise<PropertyLocation['distanceFromBase']> {
    const distanceResult = await this.getDistanceMatrix('3634 Watermelon Lane, New Smyrna Beach, FL 32168', placeId);
    return {
      meters: distanceResult.distanceMeters,
      durationSeconds: distanceResult.durationSeconds,
    };
  }

  private async calculateDistanceFromCoordinates(coordinates: LocationCoordinates): Promise<PropertyLocation['distanceFromBase']> {
    // Use Distance Matrix API with coordinates
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.set('origins', `${this.baseLocation.lat},${this.baseLocation.lng}`);
    url.searchParams.set('destinations', `${coordinates.lat},${coordinates.lng}`);
    url.searchParams.set('units', 'metric');
    url.searchParams.set('key', this.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Distance calculation failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status !== 'OK') {
      throw new Error(`Distance calculation failed: ${data.status}`);
    }

    const element = data.rows[0]?.elements[0];
    if (!element || element.status !== 'OK') {
      throw new Error(`Distance calculation failed: ${element?.status || 'No data'}`);
    }

    return {
      meters: element.distance.value,
      durationSeconds: element.duration.value,
    };
  }

  private detectPropertyType(types: string[]): PropertyLocation['propertyType'] {
    if (types.includes('premise') || types.includes('street_address')) {
      return 'residential';
    }
    if (types.includes('establishment') || types.includes('point_of_interest')) {
      return 'commercial';
    }
    if (types.includes('route') || types.includes('natural_feature')) {
      return 'agricultural';
    }
    return 'residential'; // default
  }

  private async calculateAccessibilityScore(
    lat: number, 
    lng: number, 
    propertyBounds?: google.maps.LatLngBoundsLiteral
  ): Promise<number> {
    // This would analyze terrain, road access, property size, etc.
    // For now, return a base score that could be enhanced with additional APIs
    
    // Base score
    let score = 7;
    
    // Analyze nearby roads using Google Roads API (if implemented)
    // Analyze elevation changes using Elevation API (if implemented)
    // Consider property bounds size if provided
    
    if (propertyBounds) {
      const boundsSize = this.calculateBoundsArea(propertyBounds);
      if (boundsSize > 40000) score += 1; // Large properties easier for equipment
      if (boundsSize < 4000) score -= 1; // Small properties more constrained
    }
    
    return Math.min(10, Math.max(1, score));
  }

  // TreeAI Pricing Algorithm with TreeShop Transportation Model
  private calculateTreeAIPrice(
    factors: TreeAIPricingFactors,
    distanceInfo: PropertyLocation['distanceFromBase'],
    projectAcres: number = 1
  ) {
    // TreeShop Base pricing per acre for forestry mulching based on property type
    const basePricePerAcre = {
      residential: 2800, // Higher rate for residential properties
      commercial: 2500,  // Standard commercial rate
      agricultural: 1800, // Lower rate for agricultural/farm land
      industrial: 3200,  // Higher rate for industrial complexity
    }[factors.basePropertyType];
    
    // Vegetation density multiplier for forestry mulching difficulty
    const vegetationMultiplier = {
      light: 0.8,      // Light brush/undergrowth
      moderate: 1.0,   // Standard vegetation
      heavy: 1.4,      // Dense forest/heavy brush
      extreme: 1.9,    // Very dense, mature forest requiring special equipment
    }[factors.vegetationDensity];
    
    // Terrain and access difficulty adjustment
    const accessibilityAdjustment = (10 - factors.equipmentAccessibility) * 0.05; // 0-45% adjustment
    const terrainAdjustment = (factors.terrainDifficulty - 5) * 0.03; // -15% to +15% adjustment
    const difficultyMultiplier = 1 + accessibilityAdjustment + terrainAdjustment;
    
    // Environmental and seasonal adjustments
    let environmentalAdjustment = 1.0;
    if (factors.environmentalRestrictions.length > 0) environmentalAdjustment += 0.1;
    if (factors.seasonalFactors.wetlandSeason) environmentalAdjustment += 0.15;
    if (factors.seasonalFactors.birdNestingSeason) environmentalAdjustment += 0.1;
    if (factors.seasonalFactors.fireRiskLevel === 'high') environmentalAdjustment += 0.2;
    
    // Calculate base project cost (package rate x project size)
    const baseProjectPrice = (basePricePerAcre * projectAcres) * vegetationMultiplier * environmentalAdjustment * difficultyMultiplier;
    
    // TreeShop Transportation Cost - $350/hour model
    const travelTimeMinutes = distanceInfo.durationSeconds / 60;
    const transportationCost = this.calculateTransportationCost(travelTimeMinutes);
    
    const totalEstimate = baseProjectPrice + transportationCost.transportationCost;
    
    // Calculate confidence based on data completeness
    const confidence = this.calculateEstimateConfidence(factors);
    
    return {
      basePrice: baseProjectPrice,
      travelSurcharge: transportationCost.transportationCost,
      difficultyMultiplier,
      totalEstimate,
      confidence,
      transportationBreakdown: transportationCost,
      pricingDetails: {
        pricePerAcre: basePricePerAcre,
        acres: projectAcres,
        vegetationMultiplier,
        difficultyMultiplier,
        environmentalAdjustment,
        finalPricePerAcre: (basePricePerAcre * vegetationMultiplier * environmentalAdjustment * difficultyMultiplier)
      }
    };
  }

  // Helper methods for TreeAI analysis
  private async analyzeVegetationDensity(lat: number, lng: number): Promise<'light' | 'moderate' | 'heavy' | 'extreme'> {
    // This would integrate with satellite imagery analysis
    // For now, return moderate as default
    return 'moderate';
  }
  
  private async calculateTerrainDifficulty(lat: number, lng: number): Promise<number> {
    // Would integrate with elevation/terrain APIs
    return 5; // Default moderate difficulty
  }
  
  private async assessEquipmentAccess(geocodeData: any): Promise<number> {
    // Analyze road access, property layout, etc.
    return 7; // Default good access
  }
  
  private async checkUtilityProximity(lat: number, lng: number): Promise<boolean> {
    // Check for nearby power lines, gas lines, etc.
    return false; // Default no utility issues
  }
  
  private async getEnvironmentalRestrictions(components: any): Promise<string[]> {
    // Check for environmental restrictions based on location
    return [];
  }
  
  private isWetlandSeason(): boolean {
    const month = new Date().getMonth();
    return month >= 5 && month <= 9; // June to October in Florida
  }
  
  private isBirdNestingSeason(): boolean {
    const month = new Date().getMonth();
    return month >= 2 && month <= 7; // March to August
  }
  
  private async assessFireRisk(lat: number, lng: number): Promise<'low' | 'moderate' | 'high'> {
    // Would integrate with fire risk databases
    return 'moderate';
  }
  
  private async determineMarketSegment(zipCode?: string, city?: string): Promise<'premium' | 'standard' | 'budget'> {
    // High-end Florida zip codes
    const premiumZips = ['32789', '32792', '34787', '34761', '32819']; // Winter Park, Windermere, etc.
    if (zipCode && premiumZips.includes(zipCode)) return 'premium';
    
    const premiumCities = ['winter park', 'windermere', 'bay hill', 'isleworth'];
    if (city && premiumCities.some(premium => city.toLowerCase().includes(premium))) return 'premium';
    
    return 'standard';
  }
  
  private async estimateCompetitorDensity(lat: number, lng: number): Promise<number> {
    // Would integrate with business directory APIs
    return 0.6; // Default moderate competition
  }
  
  private async isRemoteLocation(lat: number, lng: number): Promise<boolean> {
    // Check distance from populated areas
    return false;
  }
  
  private async assessWeatherRisk(lat: number, lng: number): Promise<number> {
    // Florida has moderate to high weather risk
    return 6;
  }
  
  private async estimateBuildingCount(lat: number, lng: number): Promise<number> {
    return 1; // Default
  }
  
  private async calculateVegetationCoverage(lat: number, lng: number): Promise<number> {
    return 65; // Default Florida coverage
  }
  
  private async analyzeTerrain(lat: number, lng: number) {
    return {
      averageSlope: 2.5,
      maxSlope: 8.0,
      terrainType: 'rolling' as const,
    };
  }
  
  private async identifyWaterFeatures(lat: number, lng: number): Promise<string[]> {
    return []; // Default no water features
  }
  
  private async checkUtilityClearance(lat: number, lng: number): Promise<boolean> {
    return false; // Default no utility clearance needed
  }
  
  private calculateEstimateConfidence(factors: TreeAIPricingFactors): number {
    // Calculate confidence based on available data
    let confidence = 0.7; // Base confidence
    
    if (factors.proximityToUtilities !== undefined) confidence += 0.05;
    if (factors.environmentalRestrictions.length > 0) confidence += 0.05;
    if (factors.terrainDifficulty > 0) confidence += 0.1;
    if (factors.equipmentAccessibility > 0) confidence += 0.1;
    
    return Math.min(0.95, confidence);
  }

  private calculateDistanceKm(from: LocationCoordinates, to: LocationCoordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLng = (to.lng - from.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private calculateBoundsArea(bounds: google.maps.LatLngBoundsLiteral): number {
    // Calculate approximate area in square meters
    const latDiff = bounds.north - bounds.south;
    const lngDiff = bounds.east - bounds.west;
    const avgLat = (bounds.north + bounds.south) / 2;
    
    const latMeters = latDiff * 111000; // Approximately 111km per degree
    const lngMeters = lngDiff * 111000 * Math.cos(avgLat * Math.PI / 180);
    
    return Math.abs(latMeters * lngMeters);
  }
}

// Factory function for use throughout the application with TreeAI Hive Intelligence
export function createLocationService(): LocationService | null {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.MAPS_SERVER_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Maps API key not configured for LocationService');
    return null;
  }

  return LocationService.getInstance(apiKey);
}

// Hive Intelligence Integration - Cross-domain coordination utilities
export class LocationServiceCoordinator {
  private static locationService: LocationService | null = null;
  
  static async initializeWithHiveIntelligence(): Promise<LocationService | null> {
    try {
      this.locationService = createLocationService();
      if (this.locationService) {
        console.log('✅ LocationService initialized with TreeAI Hive Intelligence');
      }
      return this.locationService;
    } catch (error) {
      console.error('❌ Failed to initialize LocationService with Hive Intelligence:', error);
      return null;
    }
  }
  
  static getService(): LocationService | null {
    return this.locationService;
  }
  
  // Cross-domain coordination methods
  static async coordinateWithPricingDomain(location: PropertyLocation) {
    // Coordinate with TreeAI Core domain for pricing
    return location.treeAIAnalysis?.estimatedCost;
  }
  
  static async coordinateWithSecurityDomain(location: PropertyLocation) {
    // Coordinate with Security Intelligence domain
    return location.riskProfile;
  }
  
  static async coordinateWithBusinessIntelligence(location: PropertyLocation) {
    // Coordinate with Business Intelligence domain
    return location.analytics;
  }
}

// Export enhanced types for use in other modules
export type { 
  PropertyLocation, 
  LocationCoordinates, 
  ServiceArea, 
  PreciseLocationRequest,
  TreeAIPricingFactors,
  LocationAnalytics,
  LocationRiskProfile
};