import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SkillTreeBuilder } from './SkillTreeBuilder.js';
import { SkillTree } from './SkillTree.js';

type AppPhase = 'treeBuilder' | 'combat';

const TreeCastApp: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<AppPhase>('treeBuilder');
  const [playerSkillTree, setPlayerSkillTree] = useState<SkillTree | null>(null);

  const handleTreeComplete = (skillTree: SkillTree) => {
    setPlayerSkillTree(skillTree);
    setCurrentPhase('combat');
    
    // Show combat UI and send skill tree to backend
    if ((window as any).showCombatUI) {
      (window as any).showCombatUI();
    }
    startCombatWithCustomTree(skillTree);
  };

  const startCombatWithCustomTree = async (skillTree: SkillTree) => {
    try {
      const response = await fetch('/api/combat/start-custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skillTree: serializeSkillTree(skillTree)
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Combat started, set up the HTML combat state and start polling
        console.log('Combat started with custom skill tree!');
        
        // Set the HTML combat state to active and start polling
        if (typeof window !== 'undefined' && (window as any).combatState) {
          (window as any).combatState.isActive = true;
          // Start the polling for combat updates
          if ((window as any).pollCombatUpdates) {
            (window as any).pollCombatUpdates();
          }
        }
        
        // Update the combat UI with the initial state
        if (result.state && (window as any).updateUI) {
          (window as any).updateUI(result.state);
        }
      } else {
        console.error('Failed to start combat:', result.error);
        alert('Failed to start combat: ' + result.error);
      }
    } catch (error) {
      console.error('Error starting combat:', error);
      alert('Error starting combat: ' + error);
    }
  };

  // Serialize skill tree for sending to backend
  const serializeSkillTree = (tree: SkillTree) => {
    const serializeNode = (node: any): any => {
      const serialized: any = {
        id: node.id,
        name: node.name,
        tags: node.tags,
        type: node.type,
        description: node.description
      };

      if (node.type === 'skill') {
        serialized.baseDamage = node.baseDamage;
      } else if (node.type === 'support') {
        serialized.childrenAmount = node.childrenAmount;
        serialized.children = node.children.map(serializeNode);
      }

      return serialized;
    };

    return {
      root: serializeNode(tree.root),
      leaves: tree.leaves.map(serializeNode)
    };
  };

  const resetToTreeBuilder = () => {
    setCurrentPhase('treeBuilder');
    setPlayerSkillTree(null);
    
    // Hide combat UI
    if ((window as any).hideCombatUI) {
      (window as any).hideCombatUI();
    }
  };

  return (
    <div className="treecast-app">
      {currentPhase === 'treeBuilder' ? (
        <SkillTreeBuilder onTreeComplete={handleTreeComplete} />
      ) : (
        <div className="combat-phase">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2>Combat Phase</h2>
            <p>Your custom skill tree has been loaded! Use the controls below to start combat.</p>
            <button onClick={resetToTreeBuilder} style={{ margin: '10px' }}>
              🔙 Back to Tree Builder
            </button>
          </div>
          {/* The existing HTML UI will handle the combat display */}
        </div>
      )}
    </div>
  );
};

// Initialize the React app
const container = document.getElementById('react-root');
if (container) {
  const root = createRoot(container);
  root.render(<TreeCastApp />);
} else {
  console.error('React root element not found');
}

export default TreeCastApp;
