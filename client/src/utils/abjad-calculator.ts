// Abjad/Adad conversion system
export const abjadValues: Record<string, number> = {
  'A': 1, 'AA': 1,
  'B': 2,
  'T': 400, 'TH': 400,
  'J': 3,
  'H': 8,
  'KH': 600,
  'D': 4,
  'DH': 700,
  'R': 200,
  'Z': 7,
  'S': 60,
  'SH': 300,
  'F': 80,
  'Q': 100,
  'K': 20,
  'L': 30,
  'M': 40,
  'N': 50,
  'W': 6, 'U': 6, 'O': 6,
  'Y': 10, 'I': 10, 'E': 10,
  'G': 3, // Same as Jeem for Urdu/Persian
  'P': 2, // Same as Ba for Urdu/Persian
  'C': 3, // For CH sound
  'V': 6, // Same as Wao
};

// Special digraph mappings
const digraphMappings: Record<string, number> = {
  'TH': 400,
  'KH': 600,
  'DH': 700,
  'SH': 300,
  'CH': 3,
  'AA': 1,
};

export function calculateAbjadValue(name: string): number {
  const upperName = name.toUpperCase().replace(/\s+/g, '');
  let total = 0;
  let i = 0;

  while (i < upperName.length) {
    // Check for two-letter combinations first
    if (i < upperName.length - 1) {
      const digraph = upperName.substring(i, i + 2);
      if (digraphMappings[digraph]) {
        total += digraphMappings[digraph];
        i += 2;
        continue;
      }
    }
    
    // Single letter mapping
    const letter = upperName[i];
    if (abjadValues[letter]) {
      total += abjadValues[letter];
    }
    i++;
  }

  return total;
}

export function calculateDigitalRoot(num: number): number {
  while (num >= 10) {
    num = Math.floor(num / 10) + (num % 10);
  }
  return num;
}

export type Element = {
  name: string;
  icon: string;
  class: string;
  arabic: string;
};

export const elementMapping: Record<number, Element> = {
  1: { name: 'Fire', icon: '🔥', class: 'element-fire', arabic: 'نار' },
  2: { name: 'Air', icon: '💨', class: 'element-air', arabic: 'ہوا' },
  3: { name: 'Water', icon: '💧', class: 'element-water', arabic: 'ماء' },
  4: { name: 'Fire', icon: '🔥', class: 'element-fire', arabic: 'نار' },
  5: { name: 'Air', icon: '💨', class: 'element-air', arabic: 'ہوا' },
  6: { name: 'Water', icon: '💧', class: 'element-water', arabic: 'ماء' },
  7: { name: 'Fire', icon: '🔥', class: 'element-fire', arabic: 'نار' },
  8: { name: 'Air', icon: '💨', class: 'element-air', arabic: 'ہوا' },
  9: { name: 'Water', icon: '💧', class: 'element-water', arabic: 'ماء' },
  0: { name: 'Earth', icon: '🌍', class: 'element-earth', arabic: 'تراب' },
};

export function getElement(digitalRoot: number): Element {
  return elementMapping[digitalRoot] || elementMapping[0];
}

export function calculateLifePathNumber(dateString: string): number | null {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const total = day + month + year;
  return calculateDigitalRoot(total);
}

export function calculateNameCompatibility(element1: Element, element2: Element): number {
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    'Fire': { 'Fire': 90, 'Air': 90, 'Water': 60, 'Earth': 70 },
    'Air': { 'Fire': 90, 'Air': 90, 'Water': 85, 'Earth': 80 },
    'Water': { 'Fire': 60, 'Air': 85, 'Water': 95, 'Earth': 95 },
    'Earth': { 'Fire': 70, 'Air': 80, 'Water': 95, 'Earth': 90 },
  };
  
  return compatibilityMatrix[element1.name]?.[element2.name] || 50;
}

export function calculateLifePathCompatibility(lifePath1: number, lifePath2: number): number {
  const lifePathDiff = Math.abs(lifePath1 - lifePath2);
  
  // Life path compatibility matrix
  const compatibilityScores: Record<number, number> = {
    0: 100, // Same life path
    1: 85,  // Very compatible
    2: 75,  // Good compatibility
    3: 65,  // Moderate compatibility
    4: 55,  // Some challenges
    5: 50,  // Significant differences
    6: 45,  // Major challenges
    7: 40,  // Very different paths
    8: 35,  // Opposing paths
  };
  
  return compatibilityScores[lifePathDiff] || 35;
}

export function calculateOverallCompatibility(nameScore: number, lifePathScore?: number): number {
  if (!lifePathScore) {
    return nameScore;
  }
  
  // Weighted average: 60% name compatibility, 40% life path compatibility
  return Math.round((nameScore * 0.6) + (lifePathScore * 0.4));
}

export function getCompatibilityLevel(score: number): string {
  if (score >= 85) return "Highly Compatible";
  if (score >= 70) return "Compatible";
  if (score >= 60) return "Moderately Compatible";
  return "Challenging Match";
}

export function getCompatibilityInsights(element1: Element, element2: Element, score: number): string {
  const combo = `${element1.name}-${element2.name}`;
  
  const insights: Record<string, string> = {
    'Fire-Fire': "Both partners share passionate, ambitious natures. This creates intense attraction but may lead to ego clashes. Success depends on channeling combined energy toward shared goals.",
    'Fire-Air': "Fire and Air create an energetic, dynamic partnership. Air fuels Fire's ambitions while Fire inspires Air's creativity. This combination often leads to exciting adventures and mutual growth.",
    'Fire-Water': "Fire meets Water in a relationship of contrasts. While challenging, this pairing can create deep emotional growth and passionate attraction. Balance is key to harmony.",
    'Fire-Earth': "Fire and Earth can build something lasting together. Earth provides stability for Fire's ambitions, while Fire brings excitement to Earth's steady nature.",
    'Air-Air': "Two Air elements create a mentally stimulating, communicative relationship. You'll never run out of things to discuss, though you may need to work on emotional depth.",
    'Air-Water': "Air and Water blend intellect with emotion beautifully. This combination creates deep understanding and emotional intelligence in the relationship.",
    'Air-Earth': "Air brings fresh ideas to Earth's practical nature, while Earth helps Air turn dreams into reality. This is often a very productive partnership.",
    'Water-Water': "Double Water elements create a deeply emotional, intuitive bond. You understand each other's feelings naturally, creating a nurturing, caring relationship.",
    'Water-Earth': "Water and Earth form one of the most harmonious combinations. This partnership is naturally nurturing, stable, and deeply supportive.",
    'Earth-Earth': "Two Earth elements build a solid, dependable foundation. While perhaps lacking spontaneity, this relationship offers security and steady growth.",
  };
  
  return insights[combo] || insights[`${element2.name}-${element1.name}`] || "Your elements create a unique dynamic that requires understanding and patience from both partners.";
}

export function getMarriageAdvice(element1: Element, element2: Element, score: number): string {
  if (score >= 85) {
    return "This pairing shows excellent potential for marriage. Your natural compatibility suggests a harmonious relationship built on mutual understanding. Focus on maintaining open communication and supporting each other's spiritual growth.";
  } else if (score >= 70) {
    return "This relationship has strong marriage potential. While there may be some differences to navigate, your core compatibility provides a solid foundation. Work on understanding each other's elemental nature and embrace your differences as strengths.";
  } else if (score >= 60) {
    return "Marriage is possible but will require effort from both partners. Focus on building strong communication skills and finding common spiritual ground. Consider premarital counseling to strengthen your bond.";
  } else {
    return "This pairing faces significant challenges that require careful consideration. If you choose to proceed, invest heavily in understanding each other's differences and building strong communication. Seek guidance from wise counselors in your community.";
  }
}
