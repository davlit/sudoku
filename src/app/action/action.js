"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var common_1 = require('../common/common');
var Action = (function () {
    function Action(type, cell, hint) {
        this._type = type;
        this._cell = cell;
        this._hint = hint;
    }
    Object.defineProperty(Action.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "cell", {
        get: function () {
            return this._cell;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "hint", {
        get: function () {
            return this._hint;
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype.toString = function () {
        return '';
    };
    return Action;
}());
exports.Action = Action;
var BaseValueAction = (function (_super) {
    __extends(BaseValueAction, _super);
    function BaseValueAction(type, cell, value, hint) {
        _super.call(this, type, cell, hint);
        this._value = value;
    }
    Object.defineProperty(BaseValueAction.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return BaseValueAction;
}(Action));
exports.BaseValueAction = BaseValueAction;
var ValueAction = (function (_super) {
    __extends(ValueAction, _super);
    function ValueAction(type, cell, value, hint) {
        _super.call(this, type, cell, value, hint);
    }
    ValueAction.prototype.toString = function () {
        var s = _super.prototype.toString.call(this)
            + common_1.Common.formatString('Set value {0} in {1},{2}', [this.value, common_1.Common.rowNr(this.cell), common_1.Common.colNr(this.cell)]);
        if (this.hint) {
            s += ' (' + this.hint.toString() + ')';
        }
        else {
            s += ' (User action)';
        }
        return s;
    };
    return ValueAction;
}(BaseValueAction));
exports.ValueAction = ValueAction;
var GuessAction = (function (_super) {
    __extends(GuessAction, _super);
    function GuessAction(type, cell, value, possibleValues, hint) {
        _super.call(this, type, cell, value, hint);
        this._possibleValues = possibleValues;
    }
    Object.defineProperty(GuessAction.prototype, "possibleValues", {
        get: function () {
            return this._possibleValues;
        },
        enumerable: true,
        configurable: true
    });
    GuessAction.prototype.toString = function () {
        var s = _super.prototype.toString.call(this)
            + common_1.Common.formatString('Guess value {0} in {1},{2} with possibles {3}', [this.value, common_1.Common.rowNr(this.cell), common_1.Common.colNr(this.cell),
                JSON.stringify(this._possibleValues)]);
        if (this.hint) {
            s += ' (' + this.hint.toString() + ')';
        }
        else {
            s += ' (User action)';
        }
        return s;
    };
    return GuessAction;
}(BaseValueAction));
exports.GuessAction = GuessAction;
var RemoveAction = (function (_super) {
    __extends(RemoveAction, _super);
    function RemoveAction(type, cell, candidate, hint) {
        _super.call(this, type, cell, hint);
        this._candidate = candidate;
    }
    Object.defineProperty(RemoveAction.prototype, "candidate", {
        get: function () {
            return this._candidate;
        },
        enumerable: true,
        configurable: true
    });
    RemoveAction.prototype.toString = function () {
        var s = _super.prototype.toString.call(this)
            + common_1.Common.formatString('Remove candidate {0} in {1},{2}', [this._candidate, common_1.Common.rowNr(this.cell), common_1.Common.colNr(this.cell)]);
        if (this.hint) {
            s += ' (' + this.hint.toString() + ')';
        }
        else {
            s += ' (User action)';
        }
        return s;
    };
    return RemoveAction;
}(Action));
exports.RemoveAction = RemoveAction;
//# sourceMappingURL=action.js.map