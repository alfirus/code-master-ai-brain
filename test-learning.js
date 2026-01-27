
/**
 * Learning Mode CLI
 */

const { codeMasterBrain } = require("./code-master-integration");

console.log("Testing learning mode...");

// Test simple functionality
async function test() {
  try {
    const brain = new codeMasterBrain();
    await brain.initialize();
    
    const result = brain.toggleLearningMode(true);
    console.log("Learning mode result:", result);
    
    const status = await brain.getStatus();
    console.log("Status:", status);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

test();

