function Sprite(filename, left, top, classCss) {
  this._node = document.createElement("img");
  this._node.src = filename;
  this._node.style.position = "absolute";
  this._node.classList = [classCss];
  document.getElementById("game").appendChild(this._node);

  Object.defineProperty(this, "left", {
    get: function () {
      return this._left;
    },
    set: function (value) {
      this._left = value;
      this._node.style.left = value + "px"
    }
  });

  Object.defineProperty(this, "top", {
    get: function () {
      return this._top;
    },
    set: function (value) {
      this._top = value;
      this._node.style.top = value + "px"
    }
  });

  Object.defineProperty(this, "display", {
    get: function () {
      return this._node.style.display;
    },
    set: function (value) {
      this._node.style.display = value;
    }
  });

  this.left = left;
  this.top = top;
  this.display = "none";
}

Sprite.prototype.startAnimation = function (fct, interval) {
  var _this = this;
  this._clock = window.setInterval(function () {
    fct(_this);
  }, interval);
};

Sprite.prototype.stopAnimation = function () {
  window.clearInterval(this._clock);
};

Sprite.prototype.checkCollision = function (other) {
  return !((this.top + this._node.height < other.top) ||
      this.top > (other.top + other._node.height) ||
      (this.left + this._node.width < other.left) ||
      this.left > (other.left + other._node.width));
};
