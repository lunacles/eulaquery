export const filter = new Map([[
  'loli', {
    highFlags: [
      'loli',
      'lolicon',
      'shota',
      'shotacon',

      'nahida_(genshin_impact)',
      'klee_(genshin_impact)',
      'qiqi_(genshin_impact)',
    ],
    mediumFlags: [],
    lowFlags: [],
  }],
  [
    'furry', {
    highFlags: [
      'furry',
      'animal',
      'anthro',
      'anthro_penetrated',
      'fur',
      'human_on_anthro',
      'human_penetrating_anthro',
      'anthro_only',
      'animal_genitalia',
      'animal_penis',
      'furry_only',
      'anthrofied',
      'male_on_anthro',
      'male_human/female_anthro',
      'submissive_anthro',
      'furry_female',
      'furry_male',
      'male_anthro',
      'anthro_penetrating_human',
      'anthro_penetrating',
      'anthro_on_human',
      'dominant_anthro',
      'male_dragon',
      'domestic_dog',
      'zoophilia  ',
      'human_on_feral ',
      'feral',
      'feral_on_feral',
      'feral_penetrating',
      'feral_on_female',
      'feral_on_human',
      'feral_penetrating_feral',
      'feral_penetrating_human',
      'feral_penetrating_anthro',
      'feral_only',
    ],
    mediumFlags: [
      'no_humans',
      'white_fur',
      'red_fur',
      'blue_fur',
      'yellow_fur',
      'purple_fur',
      'green_fur',
      'black_fur',
      'canine_humanoid',
      'canine',
      'canine_penis',
      'mammal',
      'hindpaw',
      'blue_pawpads',
      'paw_pose',
      'pawpads',
      'paws',
      'wolf',
    ],
    lowFlags: [
      'animal_ears',
      'interspecies',
      'horsecock',
      'horsecock_futanari',
      'cum_on_tail',
      'holding_tail',
      'lifted_by_tail',
      'interspecies pregnancy',
    ],
  }],
  [
    'guro', {
    highFlags: [
      'guro',
      'decapitation',
      'corpse',
      'execution',
      'severed_head',
      'necrophilia',
      'gore',
      'dead',
      'brain_fuck',
      'murder',
    ],
    mediumFlags: [
      'blood',
      'blood_from_mouth',
      'blood_in_mouth',
      'blood_on_face',
      'death',
    ],
    lowFlags: [],
  }],
  ['rape', {
    // After checking some posts on r34 it turns out this is a really popularly misused
    // tag(s). There's really no good way of filtering out actual rape content without
    // filtering out posts that look perfectly consentual, so we'll just give users a
    // placebo effect ig
    highFlags: [],
    mediumFlags: [],
    lowFlags: [],
  }],
  ['ai', {
    highFlags: [
      'ai_generated',
      'stable_diffusion',
      'ai_generated_background',
      'nai_diffusion',
    ],
    mediumFlags: [],
    lowFlags: [],
  }],
])

const Filter = class {
  constructor(type) {
    this.value = 0

    this.highFlagValue = 1
    this.mediumFlagValue = 0.25
    this.lowFlagValue = 0.1

    this.filter = filter.get(type)
  }
  check(tags) {
    let value = 0
    for (let tag of tags)
      value += this.filter.highFlags.includes(tag) + this.filter.mediumFlags.includes(tag) * 0.25 + this.filter.lowFlags.includes(tag) * 0.1

    return value >= 1
  }
}

export const Filters = {
  loli: new Filter('loli'),
  furry: new Filter('furry'),
  guro: new Filter('guro'),
  rape: new Filter('rape'),
  ai: new Filter('ai'),
}
