import React from 'react';
import * as PIXI from 'pixi.js';
import { Sprite2d } from 'pixi-projection';
import convertRGBtoHex from '../lib/rgb-to-hex';

function renderSar(sar) {
  const promise = new Promise((resolve, reject) => {
    const app = new PIXI.Application({
      width: 760,
      height: 380,
      antialias: true,
      preserveDrawingBuffer: true,
      autoDensity: true,
      backgroundAlpha: 0,
      clearBeforeRender: true
    });

    const resolution = 4;

    app.loader
      .add('spritesheet', '../spritesheet.json')
      .load(() => {
        const container = new PIXI.Container();
        app.stage.addChild(container);

        const spritesheet = app.loader.resources.spritesheet;

        const layers = [...sar.layers].reverse();

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

          container.addChild(sprite);
        }
        app.renderer.addListener('postrender', () => {
          resolve(app.view.toDataURL());
          app.destroy();
        });

      });

  });

  return promise;
}

export default class HelloWorld extends React.Component {
  constructor(props) {
    super(props);
    this.mount = React.createRef();
    this.state = {
      imageSrc: ''
    };
  }

  componentDidMount() {
    renderSar(this.props.sar)
      .then(pngBase64 => { this.setState({ imageSrc: pngBase64 }); });
  }

  componentWillUnmount() {
    PIXI.utils.destroyTextureCache();
  }

  render() {
    return (
      <>
        {/* <div ref={this.mount} onClick={this.handleClick}></div> */}
        <h1>{this.props.sar.name}</h1>
        <h2>{this.props.sar.layerCount} layers</h2>
        <img src={this.state.imageSrc} />
      </>
    );
  }
}
