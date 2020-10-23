const Selection = (function() {
  function copyTextToClipboard(text) {
    let textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      let successful = document.execCommand('copy');
      let msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
  }

  function popupwindow(url, title, w, h) {
    let left = screen.width / 2 - w / 2;
    let top = screen.height / 2 - h / 2;
    return window.open(
      url,
      title,
      'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
        w +
        ', height=' +
        h +
        ', top=' +
        top +
        ', left=' +
        left
    );
  }

  function _selection() {
    let menu = [{
        innerHTML:
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="selection__icon"><path d="M8.2,20.2c6.5,0,11.7-5.2,11.8-11.6c0-0.1,0-0.1,0-0.2c0-0.2,0-0.4,0-0.5c0.8-0.6,1.5-1.3,2.1-2.2c-0.8,0.3-1.6,0.6-2.4,0.7c0.9-0.5,1.5-1.3,1.8-2.3c-0.8,0.5-1.7,0.8-2.6,1c-1.6-1.7-4.2-1.7-5.9-0.1c-1.1,1-1.5,2.5-1.2,3.9C8.5,8.7,5.4,7.1,3.3,4.6c-1.1,1.9-0.6,4.3,1.3,5.5c-0.7,0-1.3-0.2-1.9-0.5l0,0c0,2,1.4,3.7,3.3,4.1c-0.6,0.2-1.2,0.2-1.9,0.1c0.5,1.7,2.1,2.8,3.9,2.9c-1.7,1.4-3.9,2-6.1,1.7C3.8,19.5,6,20.2,8.2,20.2"/></svg>',
        cb: (text) => alert(text) 
      },
      {
        innerHTML:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" enable-background="new 0 0 24 24" width="24" height="24" class="selection__icon"><path d="M20,2H4C2.9,2,2,2.9,2,4v16c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M18.4,7.4H17c-0.9,0-1,0.3-1,1l0,1.3 h2.1L18,12h-1.9v7h-3.2v-7h-1.2V9.6h1.2V8.1c0-2,0.8-3.1,3.1-3.1h2.4V7.4z"/></svg>',
        cb: (text) => alert(text)
      }
    ]
    menu.disable = false
    let rootElement = window;
    let selection = '';
    let text = '';
    let bgcolor = 'rgb(117, 117, 117, 1)';
    let color = '#fff';

    let _icons = {};
    let arrowsize = 5;
    let buttonmargin = 7 * 2;
    let iconsize = 24 + buttonmargin;
    let top = 0;
    let left = 0;

    function Button(innerHTML, cb) {
      const btn = document.createElement('div');
      btn.style = 'display:inline-block;' + 'margin:7px;' + 'cursor:pointer;' + 'transition:all .2s ease-in-out;';
      btn.innerHTML = innerHTML;
      btn.onclick = () => cb(text)
      btn.onmouseover = function() {
        this.style.transform = 'scale(1.2)';
      };
      btn.onmouseout = function() {
        this.style.transform = 'scale(1)';
      };
      return btn;
    }

    function IconStyle() {
      const style = document.createElement('style');
      style.innerHTML = `.selection__icon {fill: ${color};}`;
      document.body.appendChild(style);
    }

    function appendIcons() {
      const div = document.createElement('div');
      menu.forEach((item) => {
        div.appendChild(Button(item.innerHTML, item.cb));
      })
      return {
        icons: div,
        length: menu.length
      };
    }

    function setTooltipPosition() {
      const position = selection.getRangeAt(0).getBoundingClientRect();
      const DOCUMENT_SCROLL_TOP =
        window.pageXOffset || document.documentElement.scrollTop || document.body.scrollTop;
      _top = position.top + DOCUMENT_SCROLL_TOP - iconsize - arrowsize;
      top = _top >= 0 ? _top : 0;
      left = position.left + (position.width - iconsize * _icons.length) / 2;
    }

    function moveTooltip() {
      setTooltipPosition();
      let tooltip = document.querySelector('.selection');
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    }

    function drawTooltip() {
      _icons = appendIcons();
      setTooltipPosition();

      const div = document.createElement('div');
      div.className = 'selection';
      div.style =
        'color: ' + color + ';' +
        'position:absolute;' +
        'background-color: ' + bgcolor + ';' +
        'border-radius:5px;' +
        'top:' + top + 'px;' +
        'left:' + left + 'px;' +
        'transition:all .2s ease-in-out;' +
        'box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);' +
        'z-index:99999;';

      div.appendChild(_icons.icons);

      const arrow = document.createElement('div');
      arrow.style =
        'position:absolute;' +
        'border-left:' + arrowsize +
        'px solid transparent;' + 
        'border-right:' + arrowsize + 'px solid transparent;' +
        'border-top:' + arrowsize + 'px solid ' + bgcolor + ';' +
        'bottom:-' + (arrowsize - 1) + 'px;' +
        'left: 50%;' + 
        'width:0;' +
        'height:0;';

      if (!menu.disable) {
        div.appendChild(arrow);
      }

      document.body.appendChild(div);
    }

    function removeToolTip() {
      const el = document.querySelector('.selection')
      if (el) el.remove();
    }

    function checkToolTip(event, cb) {
      for (let el of event.path) {
        if (rootElement === el) {
          selection = window.getSelection();
          text = selection.toString();
          return cb();
        }
      }
      return removeToolTip();
    }

    function attachEvents() {
      function hasSelection() {
        return !!window.getSelection().toString();
      }

      function hasTooltipDrawn() {
        return !!document.querySelector('.selection');
      }

      window.addEventListener(
        'mouseup',
        function(event) {
          setTimeout(function mouseTimeout() {
            if (hasTooltipDrawn()) {
              if (hasSelection()) { 
                checkToolTip(event, moveTooltip);
              } else {
                removeToolTip();
              }
            } else if (hasSelection()) {
              checkToolTip(event, drawTooltip);
            }
          }, 10);
        },
        false
      );
    }

    function config(options) {
      if (options.menu) menu = options.menu;
      if (options.rootElement) rootElement = options.rootElement;
      if (options.backgroundColor) bgcolor = options.backgroundColor;
      if (options.iconColor) iconcolor = options.iconcolor;
      menu.disable = options.disable === undefined ? menu.disable : options.disable;
      return this;
    }

    function init() {
      IconStyle();
      attachEvents();
      return this;
    }

    return {
      config: config,
      init: init
    };
  }

  return _selection;
})();
