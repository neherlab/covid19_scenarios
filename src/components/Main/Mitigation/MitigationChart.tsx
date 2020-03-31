import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import ReactResizeDetector from 'react-resize-detector'

const ASPECT_RATIO = 16 / 9
const MOBILE_ASPECT_RATIO = 4 / 5
const MAX_TRANSMISSION_RATIO = 1.2;

interface ContainmentAction {
  start: Date
  end: Date
  reduction: number
}

interface DrawParams {
  width: number
  height: number
  d3ref: React.RefObject<SVGSVGElement>
  containmentActions: ContainmentAction[]
  handleContainmentActionsUpdate: (i: number, action: ContainmentAction) => void
  draggingNow: Boolean
  switchDraggingNow: (newDraggingNow: Boolean) => void
}


function draw({width, height, d3ref, containmentActions, handleContainmentActionsUpdate, draggingNow, switchDraggingNow}: DrawParams) {
  if (d3ref.current === null) {
    return
  }

  const margin = {
    top: Math.round(0.1 * height),
    right: Math.round(0.15 * height),
    left: Math.round(0.15 * height),
    bottom: Math.round(0.2 * height),
  };

  const tMin = new Date(2020, 2, 1);
  const tMax = new Date(2020,8,1);
  const svg = d3ref.current;

  const graph = d3
    .select(svg)
    .html(null)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const tScale = d3
    .scaleTime()
    .domain([tMin, tMax])
    .range([0, width - margin.right - margin.left]);

  const yScale = d3
    .scaleLinear()
    .domain([0, MAX_TRANSMISSION_RATIO])
    .range([height - margin.top - margin.bottom, 0]);

  // X axis
  graph
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - margin.bottom - margin.top})`)
    .call(d3.axisBottom<Date>(tScale).tickFormat(d3.timeFormat('%Y-%m-%d')))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-65)');

  // Y axis
  graph.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale));

  let leftOffset = 0;
  let rightOffset = 0;
  let bottomOffset = 0;
  const marginForResizing = 20;
  let dragType : 'move' | 'start' | 'end' | 'reduction' = 'move';
  graph.selectAll<SVGRectElement, ContainmentAction>('.bar')
    .data(containmentActions)
    .enter()
    .append('rect')
    .attr('x', d => tScale(d.start))
    .attr('y', d => yScale(1))
    .attr('width', d => tScale(d.end) - tScale(d.start))
    .attr('height', d => yScale(MAX_TRANSMISSION_RATIO - 1 + d.reduction))
    .attr('fill', '#777777')
    .attr('opacity', 0.5)
    .on('mousemove', (d, i) => {
      const mousePositionX = d3.mouse(svg)[0] - margin.left;
      const mousePositionY = d3.mouse(svg)[1] - margin.top;
      leftOffset = mousePositionX - tScale(d.start);
      rightOffset = tScale(d.end) - mousePositionX;
      bottomOffset = yScale(d.reduction) - mousePositionY;
      if (leftOffset < marginForResizing) {
        dragType = 'start';
        document.body.style.cursor = 'w-resize';
      } else if (rightOffset < marginForResizing) {
        dragType = 'end';
        document.body.style.cursor = 'e-resize';
      } else if (bottomOffset < marginForResizing) {
        dragType = 'reduction';
        document.body.style.cursor = 's-resize';
      } else {
        dragType = 'move';
        document.body.style.cursor = 'move';
      }
    })
    .on('mouseout', () => {
      if (!draggingNow) {
        document.body.style.cursor = "default";
      }
    })
    .call(
      d3
        .drag<SVGRectElement, ContainmentAction>()
        .on('start', () => {
          switchDraggingNow(true);
        })
        .on('drag', (d, i, n) => {
          const mousePositionX = d3.mouse(svg)[0] - margin.left;
          const mousePositionY = d3.mouse(svg)[1] - margin.top;
          if (dragType === 'move') {
            const width = d.end.getTime() - d.start.getTime();
            const start = tScale.invert(mousePositionX - leftOffset);
            const end = new Date(start.getTime() + width);
            if (start.getTime() >= tMin.getTime() && end.getTime() <= tMax.getTime()) {
              handleContainmentActionsUpdate(i, {...d, start, end});
            }
          } else if (dragType === 'start') {
            const start = tScale.invert(mousePositionX - leftOffset);
            const width = d.end.getTime() - start.getTime();
            if (start.getTime() >= tMin.getTime() && width > 0) {
              handleContainmentActionsUpdate(i, {...d, start});
            }
          } else if (dragType === 'end') {
            const end = tScale.invert(mousePositionX + rightOffset);
            const width = end.getTime() - d.start.getTime();
            if (end.getTime() <= tMax.getTime() && width > 0) {
              handleContainmentActionsUpdate(i, {...d, end});
            }
          } else if (dragType === 'reduction') {
            const reduction = yScale.invert(mousePositionY + bottomOffset);
            if (reduction < 1 && reduction >= 0) {
              handleContainmentActionsUpdate(i, {...d, reduction});
            }
          }
        })
        .on('end', () => {
          document.body.style.cursor = "default";
          switchDraggingNow(false);
        })
    )
}

interface MitigationChartImplParams {
  width: number
  height: number
}

function MitigationChartImpl({width, height}: MitigationChartImplParams) {
  const d3ref = useRef<SVGSVGElement>(null);
  const [containmentActions, setContainmentActions] = useState<ContainmentAction[]>([
    {
      start: new Date(2020, 3, 1),
      end: new Date(2020, 4, 1),
      reduction: 0.4
    },
    {
      start: new Date(2020,5,1),
      end: new Date(2020,7, 1),
      reduction: 0.2
    }
  ]);
  const [draggingNow, setDraggingNow] = useState<Boolean>(false);

  useEffect(() => {
      const handleContainmentActionsUpdate = (i: number, action: ContainmentAction) => {
        const newContainmentActions = [...containmentActions];
        newContainmentActions[i] = action;
        setContainmentActions(newContainmentActions);
      };
      const switchDraggingNow = (newDraggingNow: Boolean) => {
        setDraggingNow(newDraggingNow);
      };
      draw({width, height, d3ref, containmentActions, draggingNow, handleContainmentActionsUpdate, switchDraggingNow})
    },
    [d3ref, containmentActions, draggingNow, width, height]);

  return  <svg className="noselect" width={width} height={height} viewBox={`0 0 ${width} ${height}`} ref={d3ref}/>
}

export function MitigationChart() {
  return (
    <div className="w-100 h-100">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = width < 500 ? width / MOBILE_ASPECT_RATIO : width / ASPECT_RATIO

          return  <MitigationChartImpl width={width} height={height} />
        }}
      </ReactResizeDetector>
    </div>
  )
}

