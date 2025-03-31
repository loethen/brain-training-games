(function(window, document) {
  // 创建独立命名空间避免冲突
  window.FreeFocusGamesEmbed = window.FreeFocusGamesEmbed || {};
  
  // 主函数
  FreeFocusGamesEmbed.init = function(options) {
    // 合并默认选项
    var settings = {
      game: options.game || '',
      container: options.container || '',
      width: options.width || '100%',
      height: options.height || '600px',
      attribution: options.attribution !== false // 默认开启归因检查
    };
    
    // 验证必须参数
    if (!settings.game || !settings.container) {
      console.error('FreeFocusGamesEmbed: 游戏名称和容器ID是必须的');
      return;
    }
    
    // 查找容器元素
    var container = document.getElementById(settings.container);
    if (!container) {
      console.error('FreeFocusGamesEmbed: 找不到ID为 ' + settings.container + ' 的容器元素');
      return;
    }
    
    // 设置容器样式
    container.style.position = 'relative';
    container.style.width = settings.width;
    container.style.height = settings.height;
    
    // 验证归因链接
    var hasAttribution = settings.attribution ? validateAttribution(settings.game) : true;
    
    // 创建iframe
    var iframe = document.createElement('iframe');
    iframe.src = 'https://freefocusgames.com/embed/' + settings.game;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.style.border = 'none';
    iframe.allowFullscreen = true;
    
    // 添加iframe到容器
    container.appendChild(iframe);
    
    // 如果没有归因，添加水印
    if (!hasAttribution) {
      addWatermark(container, settings.game);
    }
  };
  
  // 验证归因链接
  function validateAttribution(game) {
    var links = document.getElementsByTagName('a');
    var baseUrl = 'https://freefocusgames.com/';
    var gameUrl = baseUrl + 'games/' + game;
    
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (href && (href === baseUrl || href === gameUrl || href.indexOf(gameUrl) === 0)) {
        return true;
      }
    }
    
    return false;
  }
  
  // 添加水印
  function addWatermark(container, game) {
    var watermark = document.createElement('div');
    watermark.style.position = 'absolute';
    watermark.style.bottom = '10px';
    watermark.style.right = '10px';
    watermark.style.background = 'rgba(0,0,0,0.7)';
    watermark.style.color = 'white';
    watermark.style.padding = '5px 10px';
    watermark.style.fontSize = '12px';
    watermark.style.zIndex = '1000';
    watermark.style.pointerEvents = 'none';
    watermark.innerHTML = '由 <a href="https://freefocusgames.com/games/' + game + '" target="_blank" style="color:#fff;text-decoration:underline;pointer-events:auto;">Free Focus Games</a> 提供';
    
    container.appendChild(watermark);
  }
})(window, document); 