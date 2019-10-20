import { query, trigger, transition, style, animateChild, group, animate } from '@angular/animations';

const optional = { optional: true };
const toTheRight = [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: '0',
        right: 0,
        width: '100%',
      })
    ], optional),
    query(':enter', [
      style({ right: '-100%',  })
    ]),
    group([
      query(':leave', [
        animate('300ms ease', style({ right: '100%', }))
      ], optional),
      query(':enter', [
        animate('300ms ease', style({ right: '0%'}))
      ])
    ]),
  ];
const toTheLeft = [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: '0',
        left: 0,
        width: '100%',
      })
    ], optional),
    query(':enter', [
      style({ right: '-100%',  })
    ]),
    group([
      query(':leave', [
        animate('300ms ease', style({ left: '100%', }))
      ], optional),
      query(':enter', [
        animate('300ms ease', style({ left: '0%'}))
      ])
    ]),
  ];


export const slideInAnimation =
  trigger('routeAnimations', [
    transition('isRight => isLeft', toTheLeft),
    transition('isLeft => isRight', toTheRight),
    // transition('isRight => *', slideTo('left') ),
    // transition('isLeft => *', slideTo('right') )
  ]);
