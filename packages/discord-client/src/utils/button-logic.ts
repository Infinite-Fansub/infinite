import { ButtonBuilder, ButtonInteraction } from "discord.js";

export class ButtonLogic {

    private _logic?: () => unknown;
    public id: string;

    public constructor(button: ButtonBuilder, logic?: () => unknown) {
        this._logic = logic;
        //@ts-expect-error FUCK DJS TYPES
        this.id = button.data.custom_id;
    }

    public check(interaction: ButtonInteraction): void {
        if (!this._logic) throw new Error("No logic to test was provided");
        if (interaction.customId === this.id) {
            this._logic();
            return;
        }

        return;
    }

    public set logic(logic: () => unknown) {
        this._logic = logic;
    }
}