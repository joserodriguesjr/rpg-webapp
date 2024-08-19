/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => ({
  chatGPTKey: process.env.CHATGPTKEY,
  file: {
    characters: process.env.CHARACTERS_FILE_PATH,
    occupations: process.env.OCCUPATIONS_FILE_PATH,
    equipment: process.env.EQUIPMENT_FILE_PATH,
    messages: process.env.MESSAGES_FILE_PATH,
    battle: process.env.BATTLE_FILE_PATH,
  },
});
