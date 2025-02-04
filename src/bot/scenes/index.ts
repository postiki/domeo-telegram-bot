import {Scenes} from "telegraf";
import {MyContext} from "../types";
import {calculateCost} from "./calculateCost";

export const stage = new Scenes.Stage<MyContext>([calculateCost]);