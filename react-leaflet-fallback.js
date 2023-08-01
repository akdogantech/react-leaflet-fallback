import L from 'leaflet';
import React from 'react';


import {
  useMap,  
} from "react-leaflet";


L.TileLayer.Fallback = L.TileLayer.extend({
    options: {
      minNativeZoom: 0
    },

    initialize: function (urlTemplate, options) {
      L.TileLayer.prototype.initialize.call(this, urlTemplate, options);
    },
  
    createTile: function (coords, done) {
      var tile = L.TileLayer.prototype.createTile.call(this, coords, done);
      tile._originalCoords = coords;
      tile._originalSrc = tile.src;
      tile._fallbackZoom = coords.z
  
      return tile;
    },
  
    _createCurrentCoords: function (originalCoords) {
      var currentCoords = this._wrapCoords(originalCoords);
  
      currentCoords.fallback = true;
  
      return currentCoords;
    },
  
    _originalTileOnError: L.TileLayer.prototype._tileOnError,
  
    _tileOnError: function (done, tile, e) {
      
      var layer = this,
        originalCoords = tile._originalCoords,
        currentCoords = (tile._currentCoords =
          tile._currentCoords || layer._createCurrentCoords(originalCoords)),
        fallbackZoom =
          tile._fallbackZoom === undefined
            ? originalCoords.z - 1
            : tile._fallbackZoom - 1,
        scale = (tile._fallbackScale = (tile._fallbackScale || 1) * 2),
        tileSize = layer.getTileSize(),
        style = tile.style,
        newUrl,
        top,
        left;
          
      
        
  
      if (fallbackZoom < layer.options.minNativeZoom) {
        // Handle the specific case of z/0/0 differently
        if (originalCoords.x === 0 && originalCoords.y === 0) {
          // Fallback behavior for coordinates (0, 0)
          currentCoords.x = 1;
          currentCoords.y = 1;
          currentCoords.z = originalCoords.z - 1;
        
          newUrl = layer.getTileUrl(currentCoords);
        } else {
          return this._originalTileOnError(done, tile, e);
        }
        
      }
  
      currentCoords.z = fallbackZoom;
      currentCoords.x = Math.floor(currentCoords.x / 2);
      currentCoords.y = Math.floor(currentCoords.y / 2);
  
      
      
      // Decrement fallbackZoom for the next iteration -- defines and updates the fallbackzoom.
      tile._fallbackZoom = fallbackZoom;
      
      newUrl = layer.getTileUrl(currentCoords);
  
      style.width = tileSize.x * scale + 'px';
      style.height = tileSize.y * scale + 'px';
  
      top = (originalCoords.y - currentCoords.y * scale) * tileSize.y;
      style.marginTop = -top + 'px';
      left = (originalCoords.x - currentCoords.x * scale) * tileSize.x;
      style.marginLeft = -left + 'px';
  
      style.clip =
        'rect(' +
        top +
        'px ' +
        (left + tileSize.x) +
        'px ' +
        (top + tileSize.y) +
        'px ' +
        left +
        'px)';
  
      layer.fire('tilefallback', {
        tile: tile,
        url: tile._originalSrc,
        urlMissing: tile.src,
        urlFallback: newUrl
      });
  
      tile.src = newUrl;
    },
  
    getTileUrl: function (coords) {
      var z = coords.z = coords.fallback ? coords.z : this._getZoomForUrl();
  
      var data = {
        r: L.Browser.retina ? '@2x' : '',
        s: this._getSubdomain(coords),
        x: coords.x,
        y: coords.y,
        z: z
      };
      if (this._map && !this._map.options.crs.infinite) {
        var invertedY = this._globalTileRange.max.y - coords.y;
        if (this.options.tms) {
          data['y'] = invertedY;
        }
        data['-y'] = invertedY;
      }
  
      return L.Util.template(this._url, L.extend(data, this.options));
    }
  });
  
  
  // Create a factory function for the fallback tile layer
  L.tileLayer.fallback = function (urlTemplate, options) {
    return new L.TileLayer.Fallback(urlTemplate, options);
  };

  
  const FallbackTileLayer = React.memo((props) => {
    
    const { url, ...options } = props;
    const map = useMap();
    const fallbackTileLayerRef = React.useRef(null);
    


    React.useMemo(() => {
      if (!fallbackTileLayerRef.current) {
        // Create the fallback tile layer using the factory function
        const fallbackTileLayer = L.tileLayer.fallback(url, options);
        fallbackTileLayerRef.current = fallbackTileLayer;
  
        // Add the fallback tile layer to the Leaflet map
        if (map && fallbackTileLayer) {
          fallbackTileLayer.addTo(map);
        } // Replace `map` with your Leaflet map instance
      }
    }, [url, options, map ]);
  
    React.useEffect(() => {
      // Clean up: remove the fallback tile layer from the Leaflet map when the component is unmounted
      return () => {
        if (fallbackTileLayerRef.current) {
          fallbackTileLayerRef.current.removeFrom(map);
          fallbackTileLayerRef.current = null;
        }
      };
    }, [map]);
  
    return null; // This component doesn't render any JSX, so return null
  });
  
  export default FallbackTileLayer;
  
