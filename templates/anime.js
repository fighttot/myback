export default {
  type: 'bubble',
  body: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'image',
        url: 'https://p2.bahamut.com.tw/B/ACG/c/50/0000115950.JPG',
        size: 'full',
        aspectMode: 'cover',
        aspectRatio: '2:3',
        gravity: 'top'
      },
      {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '孤獨搖滾',
                size: 'xl',
                color: '#ffffff',
                weight: 'bold'
              }
            ]
          },
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: '5.0',
                color: '#ebebeb',
                size: 'lg',
                flex: 0
              }
            ],
            spacing: 'lg'
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'filler'
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'filler'
                  },
                  {
                    type: 'text',
                    text: '立即預購',
                    color: '#ffffff',
                    flex: 0,
                    offsetTop: '-2px',
                    action: {
                      type: 'uri',
                      label: 'action',
                      uri: 'https://ani.gamer.com.tw/animeVideo.php?sn=31599'
                    }
                  },
                  {
                    type: 'filler'
                  }
                ],
                spacing: 'sm'
              },
              {
                type: 'filler'
              }
            ],
            borderWidth: '1px',
            cornerRadius: '4px',
            spacing: 'sm',
            borderColor: '#ffffff',
            margin: 'xxl',
            height: '40px'
          }
        ],
        position: 'absolute',
        offsetBottom: '0px',
        offsetStart: '0px',
        offsetEnd: '0px',
        paddingAll: '20px',
        paddingTop: '18px',
        background: {
          type: 'linearGradient',
          angle: '180deg',
          startColor: '#000000AA',
          endColor: '#000000FF'
        }
      }
    ],
    paddingAll: '0px'
  }
}
