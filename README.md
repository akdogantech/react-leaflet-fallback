# react-leaflet-fallback

react-leaflet-fallback is a plugin that provides a fallback tile layer implementation for [React Leaflet](https://react-leaflet.js.org/) maps. It allows you to load lower scaled tile images when originals are not found.

This react-leaflet implementation is heavily referenced from the original implementation of fallback tile layers for leaflet by ghybs which can be reached from [here](https://github.com/ghybs/Leaflet.TileLayer.Fallback).

## Installation

You can install the package via npm:

```bash
npm install react-leaflet-fallback
```

## Usage

Here's an example of how to use the `FallbackTileLayer` component:

```jsx
import React from 'react';
import { FallbackTileLayer } from 'react-leaflet-fallback';

// Inside your component
const MyMapComponent = () => {
  return (
    <FallbackTileLayer
      zoom={10}
      minZoom={1}
      maxZoom={15}
      maxNativeZoom={15}
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="/api/map_tiles/4uMaps/{z}/{x}/{y}.png"
      fallbackTileUrl="/api/map_tiles/4uMaps/{z}/{x}/{y}.png" // Fallback tile URL
      errorTileUrl="/api/map_tiles/error.png" // Error tile URL
    />
  );
};

export default MyMapComponent;
```

Replace the `url` and `fallbackTileUrl` properties with your own tile URLs. You can also customize other properties such as `zoom`, `minZoom`, `maxZoom`, and `attribution` according to your needs.

## Contributing

Contributions are welcome! If you find any issues or want to add new features, feel free to submit a pull request.

## License

This project is licensed under the ISC License.

