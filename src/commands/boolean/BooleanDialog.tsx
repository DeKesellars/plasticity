import { render } from 'preact';
import { AbstractDialog } from "../../command/AbstractDialog";
import { EditorSignals } from "../../editor/EditorSignals";
import { BooleanParams } from "./BooleanFactory";
import { CutParams } from "./CutFactory";

export class BooleanDialog extends AbstractDialog<BooleanParams> {
    title = "Boolean";

    constructor(protected readonly params: BooleanParams, signals: EditorSignals) {
        super(signals);
    }

    render() {
        const { mergingFaces, mergingEdges, operationType } = this.params;
        render(
            <>
                <ol class="flex flex-col py-2 m-3 my-1 space-y-1.5 text-xs border-b border-neutral-900">
                    {/* <li class="flex items-center px-1 space-x-2">
                        <plasticity-icon name="check" class="bg-green-600 rounded-full"></plasticity-icon>
                        <div class="text-xs font-bold text-neutral-200">Select target bodies</div> <div
                            class="text-xs text-neutral-500">to
                            cut or join into</div>
                    </li> */}
                    <plasticity-prompt name="Select target bodies" description="to cut or join into"></plasticity-prompt>
                    <plasticity-prompt name="Select tool bodies" description="to cut or join with"></plasticity-prompt>
                </ol>

                <ul>
                    <li>
                        <label for="mergingFaces">Merge</label>
                        <div class="fields">
                            <input type="checkbox" hidden id="mergingFaces" name="mergingFaces" checked={mergingFaces} onClick={this.onChange}></input>
                            <label for="mergingFaces">Coplanar faces</label>
                            <input type="checkbox" hidden id="mergingEdges" name="mergingEdges" checked={mergingEdges} onClick={this.onChange}></input>
                            <label for="mergingEdges">Tangent edges</label>
                        </div>
                    </li>
                </ul>
            </>, this);
    }
}
customElements.define('boolean-dialog', BooleanDialog);

export class CutDialog extends AbstractDialog<CutParams> {
    title = "Cut";

    constructor(protected readonly params: CutParams, signals: EditorSignals) {
        super(signals);
    }

    render() {
        const { mergingFaces, mergingEdges } = this.params;
        render(
            <>
                <ul>
                    <li>
                        <label for="mergingFaces">Merge</label>
                        <div class="fields">
                            <input type="checkbox" hidden id="mergingFaces" name="mergingFaces" checked={mergingFaces} onClick={this.onChange}></input>
                            <label for="mergingFaces">Coplanar faces</label>
                            <input type="checkbox" hidden id="mergingEdges" name="mergingEdges" checked={mergingEdges} onClick={this.onChange}></input>
                            <label for="mergingEdges">Tangent edges</label>
                        </div>
                    </li>
                </ul>
            </>, this);
    }
}
customElements.define('cut-dialog', CutDialog);
