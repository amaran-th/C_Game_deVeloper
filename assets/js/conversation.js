class Dialog {
    dialog1() {
        
    }
}
//hihihhihihi
   
  configDialog = {
    actor: [
      {
        id: 0,
        name: 'Player',
      },
      {
        type: 'actor',
        id: 1,
        name: 'Devil',
      },
    ],
    answer: [
      {
        id: 1,
        emotion: 1,
        text: 'Hey there {actor:0x002}, I am doing good.',
      },
      {
        id: 2,
        emotion: 7,
        text: 'Hey {actor:0x002}, I am tired today.',
      },
      {
        id: 3,
        emotion: 5,
        text: 'Not to good today {actor:0x002}. Feeling a bit down.',
      },
      {
        id: 4,
        emotion: 1,
        text: 'Sure, whats up?',
      },
      {
        id: 5,
        emotion: 0,
        text: 'Not right now.',
      },
    ],
    dialog: [
        {
        actor: 'player',
        text: '1대사1hihihihih'
          },
        {
        actor: 'player',
        text: '2대사2'
          },
        {
            actor: 'player',
            text: '3대사3'
            },
        {
            actor: 'player',
            text: '4대사4'
            },
        {
            actor: 'player',
            text: '5대사5'
            },   
        {
            actor: 'player',
            text: '6대사6'
            },         
    ],
    /*
      {
        actor: 'Pairy',
        text: '안녕 샤샤, 어제 밤하늘 봤어?',
        answers: [
          {
            answerId: 1,
            next: 2,
          },
          {
            answerId: 2,
            next: 3,
          },
          {
            answerId: 3,
            next: 4,
          },
        ],
      },
      {
        id: 2,
        type: 'statement',
        actorId: 2,
        emotion: 1,
        text: 'That is great!',
        next: 5,
      },
      {
        id: 3,
        type: 'statement',
        actorId: 2,
        emotion: 4,
        text: 'Stayed up late again last night again did you?',
        next: 5,
      },
      {
        id: 4,
        type: 'statement',
        actorId: 2,
        emotion: 4,
        text: 'Someone sounds like they woke up on the wrong side of the bed this morning.',
        next: 5,
      },
      {
        id: 5,
        type: 'question',
        actorId: 2,
        emotion: 1,
        text: 'Anyways, I had a favor to ask you if you dont mind?',
        answers: [
          {
            answerId: 4,
            next: 7,
          },
          {
            answerId: 5,
            next: 6,
          },
        ],
      },
      {
        id: 6,
        type: 'statement',
        actorId: 2,
        emotion: 5,
        text: 'Oh, okay {actor:0x001}. Maybe later then...',
        next: false,
      },
      {
        id: 7,
        type: 'statement',
        actorId: 2,
        emotion: 3,
        text: 'Awesome! Well I need you to...',
        next: false,
      },
    ],
    */
    emotion: [
      'Happy',
      'Curious',
      'Joking',
      'Joyful',
      'Playful',
      'Sad',
      'Sorrowful',
      'Tired',
    ]
  };