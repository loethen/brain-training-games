// Get base URL for embed script
function getBaseUrl() {
  var script = document.currentScript;
  var src = script ? script.src : null;

  if (!script) {
    script = document.querySelector('script[src*="embed.js"]');
    src = script ? script.src : null;
  }

  // console.log('getBaseUrl debug: script found=', !!script, 'src=', src); // Optional: Keep for debugging if needed

  if (!script || !src) {
    // console.log('getBaseUrl debug: Script not found or src is null, falling back to hardcoded.');
    return 'https://www.freefocusgames.com';
  }

  // Extract base path
  var basePath = src.split('/embed.js')[0];

  // console.log('getBaseUrl debug: basePath after split=', basePath); // Optional: Keep for debugging if needed

  // Validate basePath: Check if it's empty or doesn't look like a URL origin
  if (!basePath || !basePath.startsWith('http')) {
    // console.log('getBaseUrl debug: basePath is invalid (' + basePath + '), falling back to hardcoded.');
     return 'https://www.freefocusgames.com'; // Fallback if split resulted in empty or non-URL string
  }

  // console.log('getBaseUrl debug: Returning valid basePath=', basePath);
  return basePath;
}

// Validate attribution link
// Returns null if valid, or an error message string if invalid
function validateAttribution(game) {
  // Find all links in the document
  var links = document.getElementsByTagName('a');
  var baseUrl = 'https://www.freefocusgames.com';
  var gameUrl = baseUrl + '/games/' + game;
  
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    var href = link.getAttribute('href');
    var target = link.getAttribute('target');
    var rel = link.getAttribute('rel');
    
    // Check if all required attributes are present and correct
    if (href && 
        (href === gameUrl || href.indexOf(gameUrl) === 0) && 
        target === '_blank' && 
        (rel && rel.includes('noopener'))) {
      return null; // Link is valid
    }
  }
  
  // Link is invalid or missing - Generate styled HTML error message
  var styledErrorMessage = 
    '<div style="background-color: #fff3f3; border: 1px solid #ffcdd2; border-radius: 4px; padding: 15px; font-family: sans-serif; color: #333; text-align: left;">' + 
      '<p style="margin: 0 0 10px 0; font-weight: bold; color: #d32f2f;">Attribution Required</p>' + 
      '<p style="margin: 0 0 10px 0; font-size: 0.9em;">' + 
        'To display this game, please add the following link to your page:' + 
      '</p>' + 
      '<code style="display: block; background-color: #f5f5f5; padding: 10px; border: 1px solid #eee; border-radius: 3px; font-size: 0.85em; color: #000; overflow-x: auto; white-space: pre;">' + 
        '&lt;a href="' + gameUrl + '" target="_blank" rel="noopener" class="sr-only"&gt;Powered by Free Focus Games&lt;/a&gt;' + 
      '</code>' + 
    '</div>';

  // Also log a plain text version to the console
  console.error('Attribution Required. Please add the following link: <a href="' + gameUrl + '" target="_blank" rel="noopener" class="sr-only">Powered by Free Focus Games</a>');
  
  return styledErrorMessage;
}

// Create global namespace
window.FreeFocusGamesEmbed = {};

// Main function
FreeFocusGamesEmbed.init = function(options) {
  const { game, container, locale = 'en' } = options;
  
  if (!game) {
    console.error('Game name is required');
    return;
  }

  // Get container element first, we need it for error display too
  let containerElement;
  if (typeof container === 'string') {
    containerElement = document.getElementById(container);
    if (!containerElement) {
      console.error(`Container element with id "${container}" not found`);
      return;
    }
  } else if (container instanceof HTMLElement) {
    containerElement = container;
  } else {
    console.error('Container must be either an element ID string or an HTMLElement');
    return;
  }

  // Validate attribution link
  var attributionError = validateAttribution(game);
  if (attributionError) {
    containerElement.innerHTML = attributionError;
    return function cleanup() { // Return a cleanup function even for errors
      if (containerElement) {
        containerElement.innerHTML = ''; // Clear the error message
      }
    };
  }

  // Attribution is valid, create and append iframe
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '600px';
  iframe.style.border = 'none';
  iframe.src = `${getBaseUrl()}/${locale}/embed/${game}`;
  
  // Clear container before appending iframe (in case it had previous content)
  containerElement.innerHTML = ''; 
  containerElement.appendChild(iframe);

  // Return cleanup function for the iframe
  return function cleanup() {
    if (containerElement && containerElement.contains(iframe)) {
      containerElement.removeChild(iframe);
    }
    // Ensure container is empty after cleanup
    if (containerElement) {
      containerElement.innerHTML = '';
    }
  };
}; 