import { Intersectable } from "../editor/Intersectable";
import { ControlPoint, Curve3D, CurveEdge, Face, PlaneInstance, Region, Solid, SpaceInstance, TopologyItem } from "../editor/VisualModel";
import { SelectionMode, SelectionStrategy } from "./SelectionInteraction";
import { ModifiesSelection } from "./SelectionManager";

export class HoverStrategy implements SelectionStrategy {
    constructor(
        private readonly mode: Set<SelectionMode>,
        private readonly selected: ModifiesSelection,
        private readonly hovered: ModifiesSelection
    ) { }

    emptyIntersection(): void {
        this.hovered.removeAll();
    }

    curve3D(object: Curve3D, parentItem: SpaceInstance<Curve3D>): boolean {
        if (!this.mode.has(SelectionMode.Curve)) return false;
        if (this.selected.hasSelectedChildren(parentItem)) return false;

        this.hovered.removeAll();
        this.hovered.addCurve(parentItem);
        return true;
    }

    solid(object: TopologyItem, parentItem: Solid): boolean {
        if (!this.mode.has(SelectionMode.Solid)) return false;

        if (!this.selected.solids.has(parentItem) && !this.selected.hasSelectedChildren(parentItem)) {
            if (!this.hovered.solids.has(parentItem)) {
                this.hovered.removeAll();
                this.hovered.addSolid(parentItem);
            }
            return true;
        }
        return false;
    }

    topologicalItem(object: TopologyItem, parentItem: Solid): boolean {
        if (this.mode.has(SelectionMode.Face) && object instanceof Face) {
            if (!this.hovered.faces.has(object)) {
                this.hovered.removeAll();
                this.hovered.addFace(object, parentItem);
            }
            return true;
        } else if (this.mode.has(SelectionMode.Edge) && object instanceof CurveEdge) {
            if (!this.hovered.edges.has(object)) {
                this.hovered.removeAll();
                this.hovered.addEdge(object, parentItem);
            }
            return true;
        }
        return false;
    }

    region(object: Region, parentItem: PlaneInstance<Region>): boolean {
        if (!this.mode.has(SelectionMode.Face)) return false;
        if (!this.hovered.regions.has(parentItem)) {
            this.hovered.removeAll();
            this.hovered.addRegion(parentItem);
        }

        return true;
    }

    controlPoint(object: ControlPoint, parentItem: SpaceInstance<Curve3D>): boolean {
        if (!this.mode.has(SelectionMode.ControlPoint)) return false;
        if (!this.selected.curves.has(parentItem) && !this.selected.hasSelectedChildren(parentItem)) return false;

        if (!this.selected.controlPoints.has(object)) {
            this.hovered.removeAll();
            this.hovered.addControlPoint(object, parentItem)
            return true;
        }
        return false;
    }

    box(set: Set<Intersectable>) {
        const { hovered, selected } = this;
        hovered.removeAll();

        for (const object of set) {
            if (object instanceof Face || object instanceof CurveEdge) {
                const parentItem = object.parentItem;
                if (!selected.hasSelectedChildren(parentItem)) {
                    hovered.addSolid(parentItem);
                    return;
                }
                if (object instanceof Face) {
                    hovered.addFace(object, object.parentItem);
                } else if (object instanceof CurveEdge) {
                    hovered.addEdge(object, object.parentItem);
                }
            } else if (object instanceof Curve3D) {
                hovered.addCurve(object.parentItem);
            } else if (object instanceof ControlPoint) {
                hovered.addControlPoint(object, object.parentItem);
            } else if (object instanceof Region) {
                hovered.addRegion(object.parentItem);
            }
        }
    }
}
