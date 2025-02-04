import {Context, Scenes} from "telegraf";

interface MyWizardSession extends Scenes.WizardSessionData {
    myWizardSessionProp: number;
}


interface MySession extends Scenes.WizardSession<MyWizardSession> {
    mySessionProp: number;
}

export interface MyContext extends Context {
    myContextProp: string;
    session: MySession;
    scene: Scenes.SceneContextScene<MyContext, MyWizardSession>;
    wizard: Scenes.WizardContextWizard<MyContext>;
}