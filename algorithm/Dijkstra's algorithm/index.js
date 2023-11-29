function shortestPath(graph, startNode, endNode) {
  // 創建距離和前驅的物件
  const distances = {}
  const predecessors = {}
  const visited = new Set()

  // 初始化距離和前驅
  for (let node in graph) {
    distances[node] = Infinity
    predecessors[node] = null
  }

  distances[startNode] = 0

  while (!visited.has(endNode)) {
    let currentNode = null
    let minDistance = Infinity

    // 找到當前距離最小的節點
    for (let node in graph) {
      if (!visited.has(node) && distances[node] < minDistance) {
        minDistance = distances[node]
        currentNode = node
      }
    }

    // 更新鄰近節點的距離和前驅
    for (let neighbor in graph[currentNode]) {
      let distance = graph[currentNode][neighbor]
      let totalDistance = distances[currentNode] + distance

      if (totalDistance < distances[neighbor]) {
        distances[neighbor] = totalDistance
        predecessors[neighbor] = currentNode
      }
    }

    visited.add(currentNode)
  }

  

  // 構建最短路徑
  const path = []
  let current = endNode

  while (current !== startNode) {
    path.unshift(current)
    current = predecessors[current]
  }

  path.unshift(startNode)

  // 返回最短路徑和距離
  return {
    path: path,
    distance: distances[endNode],
  }
}

// Example
const graph = {
  A: { B: 5, C: 2 },
  B: { A: 5, C: 1, D: 3 },
  C: { A: 2, B: 1, D: 6 },
  D: { B: 3, C: 6 }
};

const startNode = 'A';
const endNode = 'D';

const result = shortestPath(graph, startNode, endNode);
console.log(result.path);      // ['A', 'C', 'B', 'D']
console.log(result.distance);  // 6