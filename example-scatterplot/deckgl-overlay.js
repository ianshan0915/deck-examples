import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';

export default class DeckGLOverlay extends Component {
  static get defaultViewport() {
    return {
      longitude: -122.4,
      latitude: 37.74,
      zoom: 11,
      maxZoom: 20,
      pitch: 30,
      bearing: 0
    };
  }

  render() {
    const {viewport, setTooltip, data} = this.props;

    const layer = new ScatterplotLayer({
      id: 'scatter-plot',
      data,
      pickable: true,
      opacity: 0.8,
      radiusScale: 6,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      getPosition: d => d.coordinates,
      getRadius: d => Math.sqrt(d.exits),
      getColor: d => [255, 140, 0],
      // onHover: ({object}) => setTooltip(`${object.name}\n${object.address}`)
      onHover: ({x, y, object}) => setTooltip(x, y, object?`${object.name}\n${object.address}`:null)
    });

    return <DeckGL width="100%" height="100%" {...viewport} layers={[layer]} />;
  }
}
