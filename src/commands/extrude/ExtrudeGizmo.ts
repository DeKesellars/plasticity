import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { CancellablePromise } from "../../util/CancellablePromise";
import { EditorLike, Mode } from "../AbstractGizmo";
import { CompositeGizmo } from "../CompositeGizmo";
import { AbstractAxialScaleGizmo, AngleGizmo, boxGeometry, DistanceGizmo, lineGeometry, MagnitudeStateMachine } from "../MiniGizmos";
import { ExtrudeParams } from "./ExtrudeFactory";

export class ExtrudeGizmo extends CompositeGizmo<ExtrudeParams> {
    private readonly distance1Gizmo = new ExtrudeDistanceGizmo("extrude:distance1", this.editor);
    private readonly race1Gizmo = new ExtrudeAngleGizmo("extrude:race1", this.editor, this.editor.gizmos.white);
    private readonly thicknessGizmo = new MagnitudeGizmo("extrude:thickness", this.editor);

    protected prepare(mode: Mode) {
        const { race1Gizmo, distance1Gizmo, thicknessGizmo } = this;
        race1Gizmo.relativeScale.setScalar(0.3);
        distance1Gizmo.relativeScale.setScalar(0.8);

        this.add(distance1Gizmo, thicknessGizmo);

        distance1Gizmo.tip.add(race1Gizmo);
    }

    execute(cb: (params: ExtrudeParams) => void, finishFast: Mode = Mode.Persistent): CancellablePromise<void> {
        const { race1Gizmo, distance1Gizmo, thicknessGizmo, params } = this;

        thicknessGizmo.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0));

        this.addGizmo(distance1Gizmo, length => {
            params.distance1 = length;
        });

        this.addGizmo(race1Gizmo, angle => {
            params.race1 = angle;
        });

        this.addGizmo(thicknessGizmo, thickness => {
            params.thickness1 = params.thickness2 = thickness;
        });

        return super.execute(cb, finishFast);
    }
}

class ExtrudeDistanceGizmo extends DistanceGizmo {
    onInterrupt(cb: (radius: number) => void) {
        this.state.push();
    }
}

class ExtrudeAngleGizmo extends AngleGizmo {
    onInterrupt(cb: (radius: number) => void) {
        this.state.push();
    }
}

export class MagnitudeGizmo extends AbstractAxialScaleGizmo {
    readonly state = new MagnitudeStateMachine(0);
    readonly tip: THREE.Mesh<any, any> = new THREE.Mesh(boxGeometry, this.material.mesh);
    protected readonly shaft = new Line2(lineGeometry, this.material.line2);
    protected readonly knob = new THREE.Mesh(new THREE.SphereGeometry(0.2), this.editor.gizmos.invisible);
    handleLength = 0.3;

    constructor(name: string, editor: EditorLike) {
        super(name, editor, editor.gizmos.default);
        this.setup();
    }

    onInterrupt(cb: (radius: number) => void) {
        this.state.push();
    }
}
