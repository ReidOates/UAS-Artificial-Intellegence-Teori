/**
 * assets/js/animation.js
 * 
 * Interactive DFA Visualization Engine
 * Academic Project: PNR Validator
 */

class DFAVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.nodes = [
            { id: 'q0', cx: 60, cy: 60, label: 'q0' },
            { id: 'q1', cx: 160, cy: 60, label: 'q1' },
            { id: 'q2', cx: 260, cy: 60, label: 'q2' },
            { id: 'q3', cx: 360, cy: 60, label: 'q3' },
            { id: 'q4', cx: 460, cy: 60, label: 'q4' },
            { id: 'q5', cx: 560, cy: 60, label: 'q5' },
            { id: 'q6', cx: 660, cy: 60, label: 'q6', isAccept: true },
            { id: 'qReject', cx: 360, cy: 220, label: 'qReject', isReject: true }
        ];

        this.validEdges = [
            { from: 'q0', to: 'q1', label: 'L' },
            { from: 'q1', to: 'q2', label: 'L' },
            { from: 'q2', to: 'q3', label: 'D' },
            { from: 'q3', to: 'q4', label: 'D' },
            { from: 'q4', to: 'q5', label: 'L' },
            { from: 'q5', to: 'q6', label: 'L' }
        ];

        this.render();
    }

    render() {
        // Inject SVG styles specific to the diagram
        const styleId = 'dfa-svg-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .dfa-svg { width: 100%; height: auto; display: block; margin: 0 auto; overflow: visible; font-family: var(--font-family); }
                .dfa-node { fill: var(--bg-surface); stroke: var(--border-light); stroke-width: 2px; transition: all 0.3s ease; }
                .dfa-node-text { fill: var(--text-main); font-size: 14px; font-weight: 500; text-anchor: middle; dominant-baseline: central; transition: all 0.3s ease; }
                .dfa-edge { stroke: var(--border-light); stroke-width: 2px; fill: none; transition: all 0.3s ease; }
                .dfa-edge-label { fill: var(--text-muted); font-size: 12px; font-weight: 600; text-anchor: middle; transition: all 0.3s ease; }
                
                /* Highlights */
                .dfa-node.active { fill: rgba(59, 130, 246, 0.2); stroke: var(--primary); stroke-width: 3px; }
                .dfa-node.active-accept { fill: rgba(16, 185, 129, 0.2); stroke: var(--success); stroke-width: 3px; }
                .dfa-node.active-reject { fill: rgba(239, 68, 68, 0.2); stroke: var(--error); stroke-width: 3px; }
                
                .dfa-edge.active { stroke: var(--primary); stroke-width: 3px; }
                .dfa-edge.active-reject { stroke: var(--error); stroke-width: 3px; }
                .dfa-edge-label.active { fill: var(--primary); font-size: 14px; }
                .dfa-edge-label.active-reject { fill: var(--error); font-size: 14px; }
            `;
            document.head.appendChild(style);
        }

        // Build SVG Elements
        let svg = `<svg class="dfa-svg" viewBox="0 0 720 280">`;
        
        // Definitions for arrowheads
        svg += `
            <defs>
                <marker id="arrow-normal" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--border-light)" />
                </marker>
                <marker id="arrow-active" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--primary)" />
                </marker>
                <marker id="arrow-reject" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--error)" />
                </marker>
            </defs>
        `;

        // Draw Reject Edges (from all valid states to qReject)
        for (let i = 0; i <= 6; i++) {
            const fromNode = this.nodes[i];
            const toNode = this.nodes[7]; // qReject
            // Draw a straight line to qReject
            svg += `<path id="edge-${fromNode.id}-qReject" class="dfa-edge" d="M ${fromNode.cx} ${fromNode.cy} L ${toNode.cx} ${toNode.cy}" marker-end="url(#arrow-normal)" />`;
        }

        // Draw Valid Transition Edges
        this.validEdges.forEach(edge => {
            const fromNode = this.nodes.find(n => n.id === edge.from);
            const toNode = this.nodes.find(n => n.id === edge.to);
            svg += `<path id="edge-${edge.from}-${edge.to}" class="dfa-edge" d="M ${fromNode.cx} ${fromNode.cy} L ${toNode.cx} ${toNode.cy}" marker-end="url(#arrow-normal)" />`;
            svg += `<text id="label-${edge.from}-${edge.to}" x="${(fromNode.cx + toNode.cx) / 2}" y="${fromNode.cy - 10}" class="dfa-edge-label">${edge.label}</text>`;
        });

        // Draw Nodes
        this.nodes.forEach(node => {
            // Draw double circle for Accept state
            if (node.isAccept) {
                svg += `<circle cx="${node.cx}" cy="${node.cy}" r="24" class="dfa-node" id="node-outer-${node.id}" />`;
            }
            svg += `<circle cx="${node.cx}" cy="${node.cy}" r="20" class="dfa-node" id="node-${node.id}" />`;
            svg += `<text x="${node.cx}" y="${node.cy}" class="dfa-node-text">${node.label}</text>`;
        });

        svg += `</svg>`;
        this.container.innerHTML = svg;
    }

    reset() {
        // Clear all active classes and reset markers
        const elements = this.container.querySelectorAll('.active, .active-accept, .active-reject');
        elements.forEach(el => {
            el.classList.remove('active', 'active-accept', 'active-reject');
            if (el.tagName === 'path') {
                el.setAttribute('marker-end', 'url(#arrow-normal)');
            }
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async animateTrace(trace) {
        this.reset();
        
        if (!trace || trace.length === 0) return;

        // Highlight start state
        this.highlightNode('q0', 'active');
        await this.sleep(400);

        for (const step of trace) {
            const edgeClass = step.toState === 'qReject' ? 'active-reject' : 'active';
            const markerId = step.toState === 'qReject' ? 'url(#arrow-reject)' : 'url(#arrow-active)';
            
            // Highlight Edge
            const edge = document.getElementById(`edge-${step.fromState}-${step.toState}`);
            const label = document.getElementById(`label-${step.fromState}-${step.toState}`);
            
            if (edge) {
                edge.classList.add(edgeClass);
                edge.setAttribute('marker-end', markerId);
            }
            if (label) label.classList.add(edgeClass);
            
            await this.sleep(400);

            // Highlight Target Node
            let nodeClass = 'active';
            if (step.toState === 'qReject') nodeClass = 'active-reject';
            if (step.toState === 'q6') nodeClass = 'active-accept';

            this.highlightNode(step.toState, nodeClass);
            
            await this.sleep(400);
            
            // Stop tracing if we hit a reject state
            if (step.toState === 'qReject') break;
        }
    }

    highlightNode(nodeId, className) {
        const node = document.getElementById(`node-${nodeId}`);
        if (node) node.classList.add(className);
        
        // Handle double circle on accept
        const outerNode = document.getElementById(`node-outer-${nodeId}`);
        if (outerNode) outerNode.classList.add(className);
    }
}