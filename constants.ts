import { Integration, Memory } from './types';

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: '📧',
    description: 'Import project details and track the context of important conversations.',
    connected: true,
    stats: { estBubbles: '30-60', firstBubbleIn: '30s', totalDuration: '15m' }
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    description: 'Extract key insights and memories from your team channels and DMs.',
    connected: true,
    stats: { estBubbles: '150-200', firstBubbleIn: '5m', totalDuration: '40m' }
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: '📓',
    description: 'Sync your workspace pages, project roadmaps, and structured knowledge.',
    connected: true,
    stats: { estBubbles: '30-60', firstBubbleIn: '1m', totalDuration: '15m' }
  },
  {
    id: 'apple',
    name: 'Voice Memos',
    icon: '🎙️',
    description: 'Transcribe and analyze your voice notes and personal ramblings.',
    connected: true,
    stats: { estBubbles: '12', firstBubbleIn: '30s', totalDuration: '5m' }
  }
];

const PICKLE_FACTS = [
    { title: "Origins in Tigris Valley", content: "Pickling began around 2030 BC in the Tigris Valley. Native cucumbers were pickled to preserve them for out-of-season consumption." },
    { title: "Cleopatra's Beauty Secret", content: "Cleopatra attributed her beauty and health to a diet of pickles." },
    { title: "Roman Soldier Fuel", content: "Julius Caesar fed pickles to his troops, believing they gave them physical and spiritual strength." },
    { title: "Columbus and Vitamin C", content: "Amerigo Vespucci and Christopher Columbus stored pickles on their ships to prevent scurvy among the crew." },
    { title: "Shakespearean Metaphor", content: "Shakespeare was one of the first to use 'in a pickle' in The Tempest, though he meant being drunk, not just in trouble." },
    { title: "Thomas Jefferson's Quote", content: "\"On a hot day in Virginia, I know nothing more comforting than a fine spiced pickle, brought up trout-like from the sparkling depths of the aromatic jar.\"" },
    { title: "Napoleon's Prize", content: "Napoleon offered a prize of 12,000 francs to anyone who could preserve food for his army. This led to the boiling process used in pickling." },
    { title: "The 57 Varieties", content: "H.J. Heinz introduced the 'pickle pin' at the 1893 Chicago World's Fair to attract customers to his booth." },
    { title: "Kosher Pickles in NYC", content: "Jewish immigrants arriving in New York during the late 19th century introduced Kosher dill pickles to America." },
    { title: "Fermentation Science", content: "Lactobacillus bacteria digest sugars in the cucumber, producing lactic acid which preserves the vegetable and gives the sour taste." },
    { title: "Kool-Aid Pickles", content: "In the Mississippi Delta, pickles marinated in Kool-Aid (fruit punch or cherry) are a popular sweet-and-sour snack." },
    { title: "Pickle Juice for Athletes", content: "Some athletes drink pickle juice to treat muscle cramps. The vinegar is thought to trigger a reflex that stops the cramping." },
    { title: "The Christmas Pickle", content: "A German-American tradition involves hiding a pickle ornament on the Christmas tree. The first child to find it gets an extra present." },
    { title: "Cornichons", content: "Tiny French pickles made from gherkins, typically served with pâté and raclette." },
    { title: "Kimchi", content: "Korea's national dish, kimchi, is a variety of salted and fermented vegetables, usually napa cabbage and Korean radishes." },
    { title: "Branston Pickle", content: "A British jarred pickled chutney made from swede, carrots, onions, and cauliflower in a thick sweet brown sauce." },
    { title: "Mango Pickle (Achar)", content: "A staple in South Asian cuisine, made from raw mangoes, oil, and a mix of spices like mustard seeds and fenugreek." },
    { title: "Pickled Eggs", content: "Hard-boiled eggs cured in vinegar or brine. A common snack in British pubs and American bars." },
    { title: "Sauerkraut", content: "Finely cut raw cabbage that has been fermented by various lactic acid bacteria." },
    { title: "Giardiniera", content: "An Italian relish of pickled vegetables in vinegar or oil, often used on beef sandwiches in Chicago." },
    { title: "Tsukemono", content: "Japanese preserved vegetables served with rice as an okazu (side dish) or with drinks as an otsumami (snack)." },
    { title: "Picklebacks", content: "A shot of whiskey followed immediately by a shot of pickle brine." },
    { title: "Nutritional Value", content: "Pickles are high in Vitamin K but can be very high in sodium due to the brine." },
    { title: "The pH Level", content: "For safe pickling, the acidity needs to be high enough (pH below 4.6) to kill botulism bacteria." },
    { title: "Bread and Butter Pickles", content: "A sweet and tangy profile, traditionally made with cucumber, onion, and bell peppers." },
    { title: "Gherkin vs Cucumber", content: "A gherkin is a variety of cucumber, usually harvested when small specifically for pickling." },
    { title: "Half-Sours", content: "Pickles that haven't fully fermented. They are still crisp and bright green, popular in New York delis." },
    { title: "Deep Fried Pickles", content: "A Southern US delicacy where pickle slices or spears are battered and fried." },
    { title: "Pickle Relish", content: "Cooked and pickled chopped vegetables, a standard topping for hot dogs in North America." },
    { title: "Umeboshi", content: "Japanese pickled plums (ume), known for being extremely sour and salty." },
    { title: "Preserved Lemon", content: "Lemons pickled in salt and their own juices, essential in Moroccan tagines." },
    { title: "Pickled Herring", content: "A traditional dish in Scandinavia and the Netherlands, herring cured in vinegar." },
    { title: "Pickled Watermelon Rind", content: "A Southern US classic making use of the leftover rind, sweet and spiced with cloves." },
    { title: "Pickled Walnuts", content: "A traditional English pickle made from green walnuts before the shells have formed." },
    { title: "Pickle Worms", content: "The pickleworm is a moth larva that is a major pest to cucumber and squash plants." },
    { title: "Department of Agriculture", content: "The USDA has specific grades for pickles based on size, flavor, and texture." },
    { title: "National Pickle Day", content: "Celebrated on November 14th in the United States." },
    { title: "Perfect Burger Topping", content: "The acidity of pickles cuts through the fat of the meat and cheese in a burger." },
    { title: "Refrigerated vs Shelf", content: "Shelf-stable pickles are pasteurized (cooked), while refrigerated ones are often fermented live (raw)." },
    { title: "Pickle Lingo: Polliwog", content: "Industry slang for a cucumber that is completely misshapen." },
    { title: "Pickle Lingo: Nubbin", content: "A crooked or short cucumber." },
    { title: "Mass Production", content: "Americans consume over 2.5 billion pounds of pickles each year." },
    { title: "Electrolytes", content: "Pickle brine is rich in electrolytes, which is why it's gaining popularity as a sports recovery drink." },
    { title: "DIY Pickling", content: "Quick pickling involves simply pouring hot vinegar brine over veggies and refrigerating; no canning required." },
    { title: "Pickled Garlic", content: "Often turns blue or green due to a reaction between enzymes and sulfur, but is safe to eat." },
    { title: "Pickle Festivals", content: "Pittsburgh, PA and Winchester, NH host large annual pickle festivals." },
    { title: "Famous Brands", content: "Vlasic, Claussen, and Mt. Olive are among the largest mass-market producers." },
    { title: "Artisanal Boom", content: "Small-batch pickling has seen a resurgence with craft flavors like spicy maple or whiskey dill." },
    { title: "Sound Crunch", content: "A 'good' pickle should be audible from 10 paces when bitten into, according to old marketing lore." },
    { title: "Space Pickles", content: "Pickles have not yet been grown in space, but preserved foods are a staple of astronaut diets." }
];

export const generateMemories = (count: number): Memory[] => {
  const memories: Memory[] = [];
  const sources = ['gmail', 'slack', 'notion', 'gpt', 'apple'] as const;
  const categories = ['History', 'Science', 'Culinary', 'Culture', 'Fact'];

  PICKLE_FACTS.forEach((fact, i) => {
    const source = sources[i % sources.length];
    const category = categories[i % categories.length];
    
    // Create a deterministic "random" image URL so it stays consistent across renders but differs per item
    // Using simple patterns or colors if picsum isn't desired, but picsum is reliable for demo
    const imageId = (i * 13) % 100; 

    memories.push({
      id: `pickle-${i}`,
      title: fact.title,
      source: source,
      date: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toLocaleDateString(),
      previewImage: `https://picsum.photos/300/300?random=${imageId}&grayscale`, // Grayscale for "privacy/memory" aesthetic, maybe? Or just random.
      content: fact.content,
      tags: [category, 'Pickles', 'Knowledge'],
      relatedIds: []
    });
  });

  // Link them up intelligently (mocking vector similarity)
  // Link by category
  memories.forEach(mem => {
    const category = mem.tags[0];
    const sameCategory = memories.filter(m => m.id !== mem.id && m.tags[0] === category);
    
    // Link to 2 randoms in same category
    for(let k=0; k<2; k++) {
        if(sameCategory.length > k) {
            mem.relatedIds.push(sameCategory[k].id);
        }
    }
    
    // Link to 1 random different category (cross-pollination)
    const random = memories[Math.floor(Math.random() * memories.length)];
    if(random.id !== mem.id && !mem.relatedIds.includes(random.id)) {
        mem.relatedIds.push(random.id);
    }
  });

  return memories;
};