import { subclass, property } from "esri/core/accessorSupport/decorators";
import { tsx } from "esri/widgets/support/widget";
import Widget from "esri/widgets/Widget";
const CSS = {
    base: 'esri-hello-world',
    emphasis: 'esri-hello-world--emphasis'
}
@subclass('esri.widgets.HelloWorld')
export class HelloWorld extends Widget {
    constructor(params?: any) {
        super(params)
    }
    @property()
    name: string = "John";
    @property()
    emphasized: boolean = false;

    // Private method
    private _getGreeting(): string {
        return `Hello, my name is ${this.name}!`;
    }

    render() {
        const greeting = this._getGreeting();
        const isEmphasis = {
            [CSS.emphasis]: this.emphasized
        };
        return (
            <div class={this.classes(CSS.base, isEmphasis)}
                afterCreate={(ele: Element) => {
                    ele.addEventListener('click', () => {
                        throw new Error('xxxxxx');
                    })
                }}>
                {greeting}
            </div>
        );
    }
}
