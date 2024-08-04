"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var predefinedMenuItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
});
var PredefinedMenuItem = (0, mongoose_1.model)("PredefinedMenuItem", predefinedMenuItemSchema);
exports.default = PredefinedMenuItem;
