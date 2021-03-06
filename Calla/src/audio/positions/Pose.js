import { project } from "../../math/project";
import { slerpVectors } from "../../math/slerpVectors";
import { Vector3 } from "../../math/Vector3";

/**
 * A position and orientation, at a given time.
 **/
export class Pose {
    /**
     * Creates a new position and orientation, at a given time.
     **/
    constructor() {
        this.t = 0;
        this.p = new Vector3();
        this.f = new Vector3();
        this.f.set(0, 0, -1);
        this.u = new Vector3();
        this.u.set(0, 1, 0);

        Object.seal(this);
    }


    /**
     * Sets the components of the pose.
     * @param {number} px
     * @param {number} py
     * @param {number} pz
     * @param {number} fx
     * @param {number} fy
     * @param {number} fz
     * @param {number} ux
     * @param {number} uy
     * @param {number} uz
     */
    set(px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.p.set(px, py, pz);
        this.f.set(fx, fy, fz);
        this.u.set(ux, uy, uz);
    }

    /**
     * Copies the components of another pose into this pose.
     * @param {Pose} other
     */
    copy(other) {
        this.p.copy(other.p);
        this.f.copy(other.f);
        this.u.copy(other.u);
    }

    /**
     * Performs a lerp between two positions and a slerp between to orientations
     * and stores the result in this pose.
     * @param {Pose} a
     * @param {Pose} b
     * @param {number} p
     */
    interpolate(start, end, t) {
        if (t <= start.t) {
            this.copy(start);
        }
        else if (end.t <= t) {
            this.copy(end);
        }
        else if (start.t < t) {
            const p = project(t, start.t, end.t);
            this.p.copy(start.p);
            this.p.lerp(end.p, p);
            slerpVectors(this.f, start.f, end.f, p);
            slerpVectors(this.u, start.u, end.u, p);
            this.t = t;
        }
    }
}
