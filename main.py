# main.py — VectorShift Pipeline Backend
# FastAPI server with DAG detection

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from collections import defaultdict, deque

app = FastAPI(title="VectorShift Pipeline API")

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Node(BaseModel):
    id: str
    type: Optional[str] = None
    data: Optional[Dict[str, Any]] = {}


class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Kahn's Algorithm (BFS topological sort) to detect cycles.
    A graph is a DAG iff topological sort processes all nodes.
    """
    if not nodes:
        return True

    node_ids = {node.id for node in nodes}

    # Build adjacency list and in-degree map
    in_degree: Dict[str, int] = defaultdict(int)
    adj: Dict[str, List[str]] = defaultdict(list)

    for node_id in node_ids:
        in_degree[node_id] = 0

    for edge in edges:
        # Only count edges between known nodes
        if edge.source in node_ids and edge.target in node_ids:
            adj[edge.source].append(edge.target)
            in_degree[edge.target] += 1

    # Start BFS from all nodes with in-degree 0
    queue = deque([n for n in node_ids if in_degree[n] == 0])
    visited_count = 0

    while queue:
        node = queue.popleft()
        visited_count += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited_count == len(node_ids)


@app.get('/')
def read_root():
    return {'Ping': 'Pong', 'status': 'VectorShift Pipeline API running'}


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    pipeline_is_dag = is_dag(pipeline.nodes, pipeline.edges)

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': pipeline_is_dag,
    }
