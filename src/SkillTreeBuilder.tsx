


import React, { useState, useEffect } from 'react';
import { SkillTree, Node, SkillNode, SupportNode } from './SkillTree.js';
import { skillNodeData, supportNodeData } from './NodeData.js';

interface TreeBuilderProps {
  onTreeComplete: (skillTree: SkillTree) => void;
}

interface NodePosition {
  x: number;
  y: number;
  level: number;
}

interface TreeDisplayNode {
  id: string;
  name: string;
  tags: string[];
  type: "skill" | "support";
  description: string;
  position: NodePosition;
  parentId?: string;
  children?: TreeDisplayNode[];
  childrenAmount?: number;
}

export const SkillTreeBuilder: React.FC<TreeBuilderProps> = ({ onTreeComplete }) => {
  const [skillTree, setSkillTree] = useState<SkillTree>(new SkillTree());
  const [buildPhase, setBuildPhase] = useState<'selectRoot' | 'buildTree' | 'complete'>('selectRoot');
  const [availableSupportNodes, setAvailableSupportNodes] = useState<SupportNode[]>([]);
  const [availableSkillNodes, setAvailableSkillNodes] = useState<SkillNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [treeDisplay, setTreeDisplay] = useState<TreeDisplayNode[]>([]);
  
  // Initialize random nodes when component mounts
  useEffect(() => {
    generateRandomNodes();
  }, []);

  // Generate random support and skill nodes for the player to choose from
  const generateRandomNodes = () => {
    console.log('Generating random nodes from:', supportNodeData, skillNodeData);
    
    // Generate random support nodes (limit to available count)
    const shuffledSupport = [...supportNodeData].sort(() => 0.5 - Math.random());
    const maxSupportCount = supportNodeData.length; // Don't exceed available support nodes
    const supportCount = Math.min(6 + Math.floor(Math.random() * 5), maxSupportCount);
    const selectedSupport = shuffledSupport.slice(0, supportCount);
    
    console.log(`Selecting ${supportCount} out of ${maxSupportCount} support nodes:`, selectedSupport.map(n => n.name));
    
    // All skill nodes are always available
    setAvailableSupportNodes(selectedSupport);
    setAvailableSkillNodes([...skillNodeData]);
    
    console.log('Selected support nodes:', selectedSupport);
    console.log('Available skill nodes:', skillNodeData);
  };

  // Handle selecting root support node
  const selectRootSupport = (supportNode: SupportNode) => {
    console.log('selectRootSupport called with:', supportNode.name);
    console.log('Available support nodes before selection:', availableSupportNodes.map(n => n.name));
    
    const newTree = new SkillTree();
    const rootInstance = newTree.createNodeInstanceByName(supportNode.name) as SupportNode;
    
    if (rootInstance) {
      console.log('Created root instance:', rootInstance);
      newTree.setRoot(rootInstance);
      setSkillTree(newTree);
      updateTreeDisplay(newTree);
      
      // Remove the selected support node from available list
      setAvailableSupportNodes(prev => {
        const filtered = prev.filter(node => node.name !== supportNode.name);
        console.log('Remaining support nodes after selection:', filtered.map(n => n.name));
        return filtered;
      });
      
      setBuildPhase('buildTree');
    }
  };

  // Add child node (support or skill) to selected parent
  const addChildNode = (childNode: SkillNode | SupportNode, parentId: string) => {
    console.log('addChildNode called with:', childNode.name, 'to parent:', parentId);
    console.log('Available support nodes before adding child:', availableSupportNodes.map(n => n.name));
    console.log('Available skill nodes before adding child:', availableSkillNodes.map(n => n.name));
    
    const childInstance = skillTree.createNodeInstanceByName(childNode.name);
    
    if (childInstance && skillTree.addChild(parentId, childInstance)) {
      console.log('Successfully added child:', childInstance.name);
      
      // Update skill tree
      const newTree = new SkillTree();
      newTree.root = skillTree.root;
      newTree.leaves = skillTree.leaves;
      setSkillTree(newTree);
      updateTreeDisplay(newTree);
      
      // Remove used node from available list
      if (childNode.type === 'support') {
        setAvailableSupportNodes(prev => {
          const filtered = prev.filter(node => node.name !== childNode.name);
          console.log('Remaining support nodes after adding child:', filtered.map(n => n.name));
          return filtered;
        });
      } else {
        setAvailableSkillNodes(prev => {
          const filtered = prev.filter(node => node.name !== childNode.name);
          console.log('Remaining skill nodes after adding child:', filtered.map(n => n.name));
          return filtered;
        });
      }
      
      setSelectedNodeId(null);
    } else {
      console.log('Failed to add child:', childNode.name, 'to parent:', parentId);
    }
  };

  // Calculate positions for tree visualization
  const updateTreeDisplay = (tree: SkillTree) => {
    const displayNodes: TreeDisplayNode[] = [];
    const visited = new Set<string>();
    
    // Calculate the total width needed for a node's children
    const calculateSubtreeWidth = (node: Node): number => {
      if (!('children' in node) || node.children.length === 0) {
        return 100; // Width of a single node
      }
      
      const childWidths = node.children.map(child => calculateSubtreeWidth(child));
      const totalChildWidth = childWidths.reduce((sum, width) => sum + width, 0);
      const minSpacing = 120; // Minimum spacing between children
      const spacingWidth = Math.max(0, (node.children.length - 1) * minSpacing);
      
      return Math.max(100, totalChildWidth + spacingWidth);
    };
    
    const calculatePositions = (node: Node, x: number, y: number, level: number, parentId?: string) => {
      if (visited.has(node.id)) return x;
      visited.add(node.id);
      
      const displayNode: TreeDisplayNode = {
        id: node.id,
        name: node.name,
        tags: node.tags,
        type: node.type,
        description: node.description,
        position: { x, y, level },
        parentId
      };

      if (node.type === 'support') {
        const supportNode = node as SupportNode;
        displayNode.children = [];
        displayNode.childrenAmount = supportNode.childrenAmount;
      }
      
      displayNodes.push(displayNode);
      
      if ('children' in node && node.children.length > 0) {
        // Calculate dynamic spacing based on number of children and subtree widths
        const nodeRadius = 40; // Radius of each node circle
        const minGap = 40; // Minimum gap between node edges
        const minChildSpacing = (nodeRadius * 2) + minGap; // Minimum center-to-center distance
        
        // Calculate subtree widths for better positioning
        const childSubtreeWidths = node.children.map(child => calculateSubtreeWidth(child));
        
        // Calculate total width needed
        const totalSubtreeWidth = childSubtreeWidths.reduce((sum, width) => sum + width, 0);
        const spacingNeeded = Math.max(0, (node.children.length - 1) * minChildSpacing);
        const totalWidthNeeded = Math.max(totalSubtreeWidth, spacingNeeded);
        
        // Position children
        const startX = x - totalWidthNeeded / 2;
        let currentX = startX;
        
        // Increase vertical spacing for nodes with more children to avoid crowding
        const verticalSpacing = node.children.length >= 3 ? 120 : 100;
        const childY = y + verticalSpacing;
        
        node.children.forEach((child, index) => {
          const childSubtreeWidth = childSubtreeWidths[index];
          const childCenterX = currentX + childSubtreeWidth / 2;
          
          calculatePositions(child, childCenterX, childY, level + 1, node.id);
          
          // Move to next position
          currentX += childSubtreeWidth;
          if (index < node.children.length - 1) {
            currentX += minChildSpacing;
          }
        });
      }
      
      return x + 150;
    };
    
    calculatePositions(tree.root, 600, 80, 0);
    setTreeDisplay(displayNodes);
  };

  // Check if all leaf nodes are skill nodes (tree completion condition)
  const areAllLeavesSkills = (): boolean => {
    console.log('=== areAllLeavesSkills DEBUG ===');
    console.log('treeDisplay:', treeDisplay);
    
    // A tree is complete if:
    // 1. Has at least one skill node
    // 2. All support nodes either have their slots filled OR have only support children
    // 3. At the deepest level, we have skill nodes (no empty support nodes at the bottom)
    
    const skillNodes = treeDisplay.filter(node => node.type === 'skill');
    const supportNodes = treeDisplay.filter(node => node.type === 'support');
    
    console.log(`Found ${skillNodes.length} skill nodes and ${supportNodes.length} support nodes`);
    
    if (skillNodes.length === 0) {
      console.log('No skill nodes found - tree incomplete');
      return false;
    }
    
    // Check each support node
    for (const supportDisplay of supportNodes) {
      const actualNode = skillTree.findNodeById(supportDisplay.id);
      if (!actualNode || !('children' in actualNode)) {
        console.log(`Support node ${supportDisplay.name} not found in actual tree`);
        continue;
      }
      
      const supportNode = actualNode as SupportNode;
      const hasChildren = supportNode.children.length > 0;
      const isFull = supportNode.children.length === supportNode.childrenAmount;
      
      console.log(`${supportNode.name}: ${supportNode.children.length}/${supportNode.childrenAmount} children`);
      console.log(`  Children:`, supportNode.children.map(c => `${c.name}(${c.type})`));
      
      // A support node is valid if:
      // - It has no children (empty is OK for intermediate nodes)
      // - OR it's completely filled
      if (hasChildren && !isFull) {
        console.log(`Support node ${supportNode.name} is partially filled - tree incomplete`);
        return false;
      }
    }
    
    console.log('All support nodes are properly filled or empty');
    console.log('=== END DEBUG ===');
    return true;
  };

  // Check if tree building is complete
  const isTreeComplete = () => {
    console.log('=== isTreeComplete DEBUG ===');
    
    // Must have at least one skill node
    const hasSkills = treeDisplay.some(node => node.type === 'skill');
    console.log('hasSkills:', hasSkills);
    
    if (!hasSkills) {
      console.log('Tree incomplete: no skill nodes');
      return false;
    }
    
    // Check that the tree structure is valid
    const isValid = areAllLeavesSkills();
    console.log('isValid:', isValid);
    
    const result = hasSkills && isValid;
    console.log('isTreeComplete result:', result);
    console.log('=== END isTreeComplete DEBUG ===');
    
    return result;
  };

  // Check if tree building is stuck (no more nodes available but tree isn't complete)
  const isTreeStuck = () => {
    const noNodesAvailable = availableSupportNodes.length === 0 && availableSkillNodes.length === 0;
    const hasIncompleteSupport = getAvailableParentNodes().length > 0;
    return noNodesAvailable && hasIncompleteSupport && !isTreeComplete();
  };

  // Complete tree building and start combat
  const completeTreeBuilding = () => {
    setBuildPhase('complete');
    onTreeComplete(skillTree);
  };

  // Get available parent nodes (support nodes with available child slots)
  const getAvailableParentNodes = (): TreeDisplayNode[] => {
    console.log('Getting available parent nodes from treeDisplay:', treeDisplay);
    const availableParents = treeDisplay.filter(node => {
      console.log('Checking node:', node.id, node.type);
      if (node.type === 'support') {
        const currentNode = skillTree.findNodeById(node.id);
        console.log('Found current node:', currentNode);
        if (currentNode && 'children' in currentNode) {
          const supportNode = currentNode as SupportNode;
          console.log(`Node ${node.id}: ${supportNode.children.length}/${supportNode.childrenAmount} children`);
          return supportNode.children.length < supportNode.childrenAmount;
        }
      }
      return false;
    });
    console.log('Available parent nodes:', availableParents);
    return availableParents;
  };

  return (
    <div className="skill-tree-builder">
      <h2>Skill Tree Builder</h2>
      
      {buildPhase === 'selectRoot' && (
        <div className="root-selection">
          <h3>Choose Your Root Support Node</h3>
          <p>Support nodes can have children. Select one to start building your tree.</p>
          <div className="skill-options">
            {availableSupportNodes.map(support => (
              <div 
                key={support.id} 
                className="skill-option"
                onClick={() => selectRootSupport(support)}
              >
                <h4>{support.name}</h4>
                <p>{support.description}</p>
                <p><strong>Max Children:</strong> {support.childrenAmount}</p>
                <div className="tags">
                  {support.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {buildPhase === 'buildTree' && (
        <div className="tree-building">
          <div className="tree-visualization">
            <svg width="1200" height="800" className="tree-svg">
              {/* Draw connections */}
              {treeDisplay.map(node => 
                node.parentId ? (
                  <line
                    key={`line-${node.id}`}
                    x1={treeDisplay.find(n => n.id === node.parentId)?.position.x || 0}
                    y1={(treeDisplay.find(n => n.id === node.parentId)?.position.y || 0) + 30}
                    x2={node.position.x}
                    y2={node.position.y + 30}
                    stroke="#888"
                    strokeWidth="2"
                  />
                ) : null
              )}
              
              {/* Draw nodes */}
              {treeDisplay.map(node => (
                <g key={node.id}>
                  <circle
                    cx={node.position.x}
                    cy={node.position.y + 30}
                    r="25"
                    fill={node.type === 'skill' ? '#ff6b6b' : '#4ecdc4'}
                    stroke={selectedNodeId === node.id ? '#fff' : '#333'}
                    strokeWidth="3"
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <text
                    x={node.position.x}
                    y={node.position.y + 35}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {node.name.substring(0, 8)}
                  </text>
                  
                  {/* Show available child slots for support nodes */}
                  {node.type === 'support' && (
                    <text
                      x={node.position.x}
                      y={node.position.y + 50}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="8"
                    >
                      {(() => {
                        const currentNode = skillTree.findNodeById(node.id);
                        if (currentNode && 'children' in currentNode) {
                          const supportNode = currentNode as SupportNode;
                          return `${supportNode.children.length}/${supportNode.childrenAmount}`;
                        }
                        return '0/0';
                      })()}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>

          <div className="support-selection">
            <h3>Build Your Skill Tree</h3>
            <p>Debug: Available support nodes: {availableSupportNodes.length}</p>
            <p>Debug: Available skill nodes: {availableSkillNodes.length}</p>
            <p>Debug: Selected node ID: {selectedNodeId}</p>
            <p>Debug: Available parent nodes: {getAvailableParentNodes().length}</p>
            <p>Debug: All leaves are skills: {areAllLeavesSkills().toString()}</p>
            
            {getAvailableParentNodes().length === 0 ? (
              <div>
                <p><strong>👆 Click on a support node in the tree above to add children to it!</strong></p>
                <p>Support nodes (teal circles) can have children. Skill nodes (red circles) are always leaves.</p>
              </div>
            ) : selectedNodeId && getAvailableParentNodes().find(n => n.id === selectedNodeId) ? (
              <div>
                <p>Add a child to <strong>
                  {treeDisplay.find(n => n.id === selectedNodeId)?.name}
                </strong>:</p>
                
                {availableSupportNodes.length > 0 && (
                  <div>
                    <h4>Support Nodes (can have children)</h4>
                    <div className="support-options">
                      {availableSupportNodes.map(support => (
                        <div 
                          key={support.id}
                          className="support-option"
                          onClick={() => addChildNode(support, selectedNodeId!)}
                        >
                          <h4>{support.name}</h4>
                          <p>{support.description}</p>
                          <p>Max Children: {support.childrenAmount}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {availableSkillNodes.length > 0 && (
                  <div>
                    <h4>Skill Nodes (always leaves)</h4>
                    <div className="support-options">
                      {availableSkillNodes.map(skill => (
                        <div 
                          key={skill.id}
                          className="support-option"
                          onClick={() => addChildNode(skill, selectedNodeId!)}
                        >
                          <h4>{skill.name}</h4>
                          <p>{skill.description}</p>
                          <p>Type: Skill (leaf node)</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {availableSupportNodes.length === 0 && availableSkillNodes.length === 0 && (
                  <div className="no-nodes-available" style={{ 
                    padding: '15px', 
                    backgroundColor: '#ffeaa7', 
                    border: '2px solid #fdcb6e', 
                    borderRadius: '5px', 
                    margin: '10px 0',
                    textAlign: 'center'
                  }}>
                    <p><strong>⚠️ No nodes available!</strong></p>
                    <p>All support and skill nodes have been used. This support node cannot have any more children.</p>
                    <p>Either select a different support node or complete your tree.</p>
                  </div>
                )}
              </div>
            ) : (
              <p>Select a support node in the tree that has available child slots</p>
            )}
          </div>

          {isTreeComplete() && (
            <div className="completion">
              <p><strong>🎉 Tree is valid!</strong> All leaf nodes are skill nodes.</p>
              <button 
                className="complete-button"
                onClick={completeTreeBuilding}
              >
                Complete Tree & Start Combat
              </button>
            </div>
          )}

          {isTreeStuck() && (
            <div className="warning" style={{ 
              padding: '15px', 
              backgroundColor: '#fab1a0', 
              border: '2px solid #e17055', 
              borderRadius: '5px', 
              margin: '10px 0',
              textAlign: 'center'
            }}>
              <p><strong>⚠️ Tree building is stuck!</strong></p>
              <p>All nodes have been used, but some support nodes still have empty child slots.</p>
              <p>You may need to start over with a different tree structure.</p>
              <button 
                className="restart-button"
                onClick={() => window.location.reload()}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#d63031', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginTop: '10px'
                }}
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      )}

      {buildPhase === 'complete' && (
        <div className="tree-complete">
          <h3>Tree Building Complete!</h3>
          <p>Your skill tree has been built and combat will begin shortly.</p>
        </div>
      )}
    </div>
  );
};