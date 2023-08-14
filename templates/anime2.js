export default {
  type: 'bubble',
  header: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'image',
            url: 'https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip4.jpg',
            size: 'full',
            aspectMode: 'cover',
            aspectRatio: '150:196',
            gravity: 'center',
            flex: 1
          }
        ]
      }
    ],
    paddingAll: '0px'
  },
  body: {
    type: 'box',
    layout: 'vertical',
    contents: [
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
                contents: [],
                size: 'xl',
                wrap: true,
                text: 'Cony Residence',
                color: '#ffffff',
                weight: 'bold'
              },
              {
                type: 'text',
                text: '3 Bedrooms, ¥35,000',
                color: '#ffffffcc',
                size: 'sm'
              }
            ],
            spacing: 'sm'
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
                    contents: [],
                    size: 'sm',
                    wrap: true,
                    margin: 'lg',
                    color: '#ffffffde',
                    text: 'Private Pool, Delivery box, Floor heating, Private Cinema'
                  }
                ]
              }
            ],
            paddingAll: '13px',
            backgroundColor: '#ffffff1A',
            cornerRadius: '2px',
            margin: 'xl'
          }
        ]
      }
    ],
    paddingAll: '20px',
    backgroundColor: '#464F69'
  }
}
