import React from 'react';
import * as PIXI from 'pixi.js';
import { Sprite2d } from 'pixi-projection';
import convertRGBtoHex from '../lib/rgb-to-hex';

export default class HelloWorld extends React.Component {
  constructor(props) {
    super(props);
    this.mount = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      imageSrc: ''
    };
  }

  handleClick() {
  }

  componentDidMount() {
    this.app = new PIXI.Application({
      width: 760,
      height: 380,
      antialias: true,
      clearBeforeRender: true,
      autoDensity: true,
      backgroundAlpha: 0
    });

    const resolution = 4;

    this.app.loader
      .add('spritesheet', '../spritesheet.json')
      .load(() => {
        this.app.stage.removeChildren(0);

        const spritesheet = this.app.loader.resources.spritesheet;

        const layers = this.props.sar.layers.reverse();

        const offsetX = -126;
        const offsetY = -317;

        for (let i = 0; i < layers.length; i++) {
          const layer = layers[i];
          const layerPath = `${layer.props.textureIndex + 1}.png`;
          const corners = [
            {
              x: layer.points.topLeft.x * resolution + offsetX,
              y: layer.points.topLeft.y * resolution + offsetY
            },
            {
              x: layer.points.topRight.x * resolution + offsetX,
              y: layer.points.topRight.y * resolution + offsetY
            },
            {
              x: layer.points.bottomRight.x * resolution + offsetX,
              y: layer.points.bottomRight.y * resolution + offsetY
            },
            {
              x: layer.points.bottomLeft.x * resolution + offsetX,
              y: layer.points.bottomLeft.y * resolution + offsetY
            }
          ];
          const { props } = layer;
          const { colorR, colorG, colorB, transparency, visible } = props;

          let trueAlpha = transparency / 7;
          if (!visible) trueAlpha = 0;

          const trueR = colorR * 4;
          const trueG = colorG * 4;
          const trueB = colorB * 4;

          const hex = convertRGBtoHex(trueR, trueG, trueB);

          const sprite = new Sprite2d(spritesheet.textures[layerPath]);
          sprite.anchor.set(0.5);
          sprite.tint = hex;
          sprite.alpha = trueAlpha;
          sprite.proj.mapSprite(sprite, corners);

          this.app.stage.addChild(sprite);
        }
        console.dir(this.app.renderer.plugins.extract.base64(this.app.stage));
        this.mount.current.appendChild(this.app.view);
      });
  }

  render() {
    return (
      <>
        <div ref={this.mount} onClick={this.handleClick}></div>
        <img src={this.state.imageSrc} />
      </>
    );
  }
}
