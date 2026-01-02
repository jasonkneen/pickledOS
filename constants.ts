
import { Integration, Memory } from './types';

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'pickles',
    name: 'Pickle Knowledge',
    icon: '🥒',
    description: 'A comprehensive history and scientific analysis of pickled cucumbers.',
    connected: true,
    type: 'knowledge',
    stats: { estBubbles: '50', firstBubbleIn: 'Instant', totalDuration: 'N/A' }
  },
  {
    id: 'space',
    name: 'Cosmic Wonders',
    icon: '🪐',
    description: 'Deep dive into black holes, neutron stars, and the mysteries of the universe.',
    connected: false,
    type: 'knowledge',
    stats: { estBubbles: '50', firstBubbleIn: 'Instant', totalDuration: 'N/A' }
  },
  {
    id: 'coffee',
    name: 'Coffee Culture',
    icon: '☕',
    description: 'From Ethiopian goats to modern espresso: the journey of the bean.',
    connected: false,
    type: 'knowledge',
    stats: { estBubbles: '50', firstBubbleIn: 'Instant', totalDuration: 'N/A' }
  },
  {
    id: 'gmail',
    name: 'Gmail (Simulated)',
    icon: '📧',
    description: 'Import project details and track the context of important conversations.',
    connected: false,
    type: 'app',
    stats: { estBubbles: '30-60', firstBubbleIn: '30s', totalDuration: '15m' }
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

const SPACE_FACTS = [
    { title: "Solar Mass Dominance", content: "The Sun accounts for 99.86% of the mass in our entire solar system." },
    { title: "Neutron Star Density", content: "A teaspoon of neutron star material would weigh about 6 billion tons." },
    { title: "Silent Space", content: "Space is completely silent because there is no atmosphere to carry sound waves." },
    { title: "Venus Day vs Year", content: "A day on Venus is longer than a year on Venus due to its slow rotation." },
    { title: "Footprints on the Moon", content: "The footprints on the Moon will be there for 100 million years because there is no wind to erode them." },
    { title: "Blue Sunset on Mars", content: "Sunsets on Mars appear blue to human observers due to the fine dust in the atmosphere." },
    { title: "Largest Volcano", content: "Olympus Mons on Mars is the largest volcano in the solar system, three times the height of Everest." },
    { title: "Diamond Rain", content: "It rains diamonds on Saturn and Jupiter due to the intense pressure turning carbon into crystal." },
    { title: "Galactic Center Smell", content: "The center of the Milky Way smells like raspberries and tastes like rum due to ethyl formate." },
    { title: "Expanding Universe", content: "The universe is expanding faster than the speed of light." },
    { title: "Voyager 1 Distance", content: "Voyager 1 is the most distant human-made object, currently in interstellar space." },
    { title: "Light Year", content: "A light-year is the distance light travels in one year, about 5.88 trillion miles." },
    { title: "Number of Stars", content: "There are more stars in the universe than grains of sand on all the beaches on Earth." },
    { title: "Cold Welding", content: "If two pieces of the same type of metal touch in space, they will bond and be permanently stuck together." },
    { title: "Dark Matter", content: "Dark matter makes up about 27% of the universe, but we cannot see or detect it directly." },
    { title: "Great Red Spot", content: "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years." },
    { title: "Exoplanets", content: "We have confirmed the existence of over 5,000 exoplanets orbiting other stars." },
    { title: "Black Hole Spaghettification", content: "If you fell into a black hole, you would be stretched out like spaghetti." },
    { title: "ISS Speed", content: "The International Space Station orbits Earth every 90 minutes at a speed of 17,500 mph." },
    { title: "Moon drifting away", content: "The Moon is moving away from Earth at a rate of about 3.8 cm per year." },
    { title: "Saturn's Rings", content: "Saturn's rings are made mostly of ice particles, some as small as dust, others as big as mountains." },
    { title: "Space Junk", content: "There are over 128 million pieces of debris smaller than 1 cm orbiting Earth." },
    { title: "Uranus Tilt", content: "Uranus spins on its side, likely due to a massive collision early in its history." },
    { title: "Temperature Extremes", content: "The temperature in the void of space is about -270.45 degrees Celsius." },
    { title: "Pulsars", content: "Pulsars are magnetized rotating neutron stars that emit beams of electromagnetic radiation." },
    { title: "Andromeda Collision", content: "The Andromeda galaxy is on a collision course with the Milky Way, expected in 4.5 billion years." },
    { title: "Water in Space", content: "Astronomers have found a massive water vapor cloud holding 140 trillion times the mass of water in Earth's oceans." },
    { title: "Cost of Spacesuit", content: "A full NASA space suit costs approximately $12 million." },
    { title: "First Dog in Space", content: "Laika was the first animal to orbit Earth, launched by the USSR in 1957." },
    { title: "Pluto's Heart", content: "Pluto has a large heart-shaped glacier made of nitrogen ice." },
    { title: "Ganymede", content: "Jupiter's moon Ganymede is the largest moon in the solar system, bigger than Mercury." },
    { title: "Solar Flares", content: "A single solar flare can release the energy equivalent of millions of 100-megaton hydrogen bombs." },
    { title: "Theory of Relativity", content: "Time passes slower the closer you are to a massive object, a phenomenon known as time dilation." },
    { title: "Kuiper Belt", content: "A region beyond Neptune filled with icy bodies and dwarf planets." },
    { title: "Oort Cloud", content: "A theoretical shell of icy objects that exist in the outermost reaches of the solar system." },
    { title: "Goldilocks Zone", content: "The habitable zone around a star where conditions are just right for liquid water to exist." },
    { title: "Fermi Paradox", content: "The contradiction between the lack of evidence for extraterrestrial civilizations and high estimates for their probability." },
    { title: "Cosmic Microwave Background", content: "The afterglow radiation left over from the Big Bang." },
    { title: "Lagrange Points", content: "Positions in space where the gravitational forces of two large bodies balance the centrifugal force felt by a smaller body." },
    { title: "Tidal Locking", content: "The moon is tidally locked to Earth, meaning we always see the same face." },
    { title: "Variable Stars", content: "Stars that change in brightness over time." },
    { title: "Supernova", content: "The explosive death of a massive star." },
    { title: "Nebula", content: "A giant cloud of dust and gas in space, often a nursery for new stars." },
    { title: "Quasars", content: "Extremely luminous active galactic nuclei." },
    { title: "Event Horizon", content: "The boundary around a black hole beyond which nothing can escape." },
    { title: "Wormholes", content: "Theoretical passages through space-time that could create shortcuts for long journeys." },
    { title: "Space Elevator", content: "A proposed type of planet-to-space transportation system." },
    { title: "Terraforming", content: "The hypothetical process of deliberately modifying the atmosphere of a planet to make it habitable." },
    { title: "Search for Life", content: "SETI is an organization dedicated to searching for extraterrestrial intelligence." },
    { title: "Multiverse", content: "The theory that there are multiple universes existing parallel to our own." }
];

const COFFEE_FACTS = [
    { title: "Goat Discovery", content: "Legend has it that Ethiopian shepherds first noticed the effects of coffee when their goats started dancing after eating coffee berries." },
    { title: "World's Second Commodity", content: "Coffee is the second most traded commodity in the world, surpassed only by crude oil." },
    { title: "Espresso Meaning", content: "Espresso comes from the Italian word meaning 'pressed out', referring to the way it is made." },
    { title: "Hawaii Coffee", content: "Hawaii is the only state in the United States that grows coffee commercially." },
    { title: "Finland's Addiction", content: "Finland consumes the most coffee in the world per capita." },
    { title: "Beethoven's Brew", content: "Beethoven was obsessive about his coffee, using exactly 60 beans per cup." },
    { title: "Fruit, Not Bean", content: "Coffee beans are actually the pits of a cherry-like fruit." },
    { title: "Decaf Process", content: "Coffee is decaffeinated by steaming the unroasted beans or soaking them in a solvent." },
    { title: "Kopi Luwak", content: "The most expensive coffee in the world comes from the dung of the Asian palm civet." },
    { title: "Banned in Mecca", content: "Coffee was banned in Mecca in 1511 because it was believed to stimulate radical thinking." },
    { title: "Instant Coffee", content: "George Washington invented instant coffee... not the president, but a Belgian man living in Guatemala." },
    { title: "Two Types", content: "There are two main types of coffee: Arabica (mild, aromatic) and Robusta (bitter, high caffeine)." },
    { title: "Americano Origin", content: "American soldiers in WWII would dilute their espresso with water to mimic the coffee back home, creating the Americano." },
    { title: "Coffee Belt", content: "All coffee in the world grows in the 'Bean Belt', between the Tropics of Cancer and Capricorn." },
    { title: "Caffeine Half-Life", content: "The half-life of caffeine is about 6 hours, meaning if you drink a cup at 4pm, half is still in your system at 10pm." },
    { title: "First Webcam", content: "The first webcam was invented at Cambridge University to monitor a coffee pot." },
    { title: "Brazil's Dominance", content: "Brazil produces about 40% of the world's coffee." },
    { title: "Boston Tea Party", content: "After the Boston Tea Party, it became patriotic for Americans to drink coffee instead of tea." },
    { title: "Turkish Proverbs", content: "A Turkish proverb describes coffee as 'Black as hell, strong as death, and sweet as love'." },
    { title: "Bach's Coffee Cantata", content: "J.S. Bach wrote a comedic opera about a woman addicted to coffee." },
    { title: "Chlorogenic Acid", content: "Coffee contains chlorogenic acid, which helps slow down the absorption of sugar." },
    { title: "Light vs Dark Roast", content: "Light roast coffee actually has slightly more caffeine than dark roast." },
    { title: "Cappuccino Name", content: "Named after the Capuchin friars because the color resembled their robes." },
    { title: "Fair Trade", content: "Fair Trade coffee ensures farmers are paid a fair price and work in good conditions." },
    { title: "Cold Brew", content: "Cold brew is made by steeping grounds in cold water for 12-24 hours, resulting in lower acidity." },
    { title: "Poison Warning", content: "Voltaire supposedly drank 50 cups a day. When told it was a slow poison, he said 'I think it must be, for I have been drinking it for eighty-five years and am not dead yet'." },
    { title: "Grounds for Fuel", content: "Scientists are developing ways to turn used coffee grounds into biodiesel." },
    { title: "Q Graders", content: "Certified coffee tasters are called Q Graders, similar to sommeliers for wine." },
    { title: "Slurping", content: "Professional coffee tasters slurp coffee to spray it across their entire palate." },
    { title: "Cascara", content: "A tea made from the dried skins of the coffee fruit." },
    { title: "Irish Coffee", content: "Invented to warm up frozen American passengers leaving from Foynes, Ireland." },
    { title: "Antioxidants", content: "For many Americans, coffee is the number one source of antioxidants in their diet." },
    { title: "Espresso Caffeine", content: "A single shot of espresso has less caffeine than a standard cup of drip coffee." },
    { title: "Blossom Time", content: "A coffee tree takes 3 to 4 years to mature and produce its first crop." },
    { title: "Divorce Reason", content: "In ancient Arab culture, a woman could legally divorce her husband if he didn't provide enough coffee." },
    { title: "Stock Market", content: "The London Stock Exchange started in a coffee house." },
    { title: "Insurance", content: "Lloyd's of London, the insurance market, also started in a coffee house." },
    { title: "Largest Cup", content: "The largest cup of coffee ever made held over 6,000 gallons." },
    { title: "Mocha", content: "Named after the port city of Mocha in Yemen." },
    { title: "Coffee Bans", content: "Sweden banned coffee five times between 1756 and 1817." },
    { title: "Growing Conditions", content: "Coffee needs rich soil, mild temperatures, frequent rain, and shaded sun." },
    { title: "Peaberry", content: "A natural mutation where the coffee cherry contains only one bean instead of two, prized for flavor." },
    { title: "Flat White", content: "A coffee drink consisting of espresso with microfoam, originating from Australia/New Zealand." },
    { title: "Macchiato", content: "Means 'marked' or 'stained' - espresso marked with a dollop of foam." },
    { title: "Sustainable Farming", content: "Shade-grown coffee preserves biodiversity and is better for the environment." },
    { title: "French Press", content: "Actually patented by an Italian designer in 1929." },
    { title: "Ethiopian Ceremony", content: "A traditional coffee ceremony in Ethiopia can take hours and involves roasting beans on the spot." },
    { title: "Green Coffee", content: "Unroasted coffee beans are green and can be stored for long periods." },
    { title: "Robusta Resistance", content: "Robusta plants are more resistant to disease and pests than Arabica." },
    { title: "Latte Art", content: "The method of preparing milk foam to create patterns on the surface of espresso drinks." }
];

export const DATASETS: Record<string, any[]> = {
    'pickles': PICKLE_FACTS,
    'space': SPACE_FACTS,
    'coffee': COFFEE_FACTS,
};

export const generateMemories = (datasetId: string = 'pickles'): Memory[] => {
  const dataset = DATASETS[datasetId] || PICKLE_FACTS;
  const memories: Memory[] = [];
  const sources = ['wiki', 'book', 'article', 'lecture'] as const;
  
  // Deterministic category mapping based on dataset
  let categories = ['Fact'];
  if (datasetId === 'pickles') categories = ['History', 'Science', 'Culinary'];
  if (datasetId === 'space') categories = ['Astronomy', 'Physics', 'Cosmos'];
  if (datasetId === 'coffee') categories = ['History', 'Culture', 'Botany'];

  dataset.forEach((fact, i) => {
    const source = sources[i % sources.length];
    const category = categories[i % categories.length];
    
    // Create a deterministic "random" image URL so it stays consistent across renders but differs per item
    // Using picsum with a seed based on dataset and index
    const seed = `${datasetId}-${i}-${Math.random()}`; // Ensure uniqueness even if re-generated
    
    // Removed isGray logic to ensure all images are colorful and distinct
    memories.push({
      id: `${datasetId}-${i}`,
      title: fact.title,
      source: source,
      sourceId: datasetId,
      date: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toLocaleDateString(),
      previewImage: `https://picsum.photos/seed/${seed}/300/300`, 
      content: fact.content,
      tags: [category, datasetId.charAt(0).toUpperCase() + datasetId.slice(1)],
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
