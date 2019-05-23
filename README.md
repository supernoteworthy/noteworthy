Noteworthy is an in-progress music editor with a sheet music interface. It is written in TypeScript, and uses React, MobX, and the Web Audio API.

Try it out here! https://supernoteworthy.com

<img width="680" alt="Screen Shot 2019-04-08 at 12 41 50 PM" src="https://user-images.githubusercontent.com/120403/55741610-b3388580-59fb-11e9-925f-3ef375581760.png">

Currently, it supports:

- Insert, drag and drop of notes, rests, accidentals, repeats, etc.
- Playback (hit "enter" to hear your music)!
- Edit while you play! Try moving the bounds of a repeat while in playback mode.
- Piece-wide key signatures.
- Chords that snap into place.
- Varying octave, volume, tempo inside the piece.
- A few instruments (piano, sine and sawtooth waves, and a snare).

Here is a screenshot of the insertion UI!

![noteworthy-gif](https://user-images.githubusercontent.com/120403/55741338-065e0880-59fb-11e9-86c3-9ed73c1d000a.gif)

To run it locally, use `npm start`.

Credits:

- Cappie Pomeroy, for coming up with the project name!
- [Ant Design Toolkit](https://ant.design/) for buttons, drop-downs, tooltips, etc.
- [Salamander Grand Piano V3](https://archive.org/details/SalamanderGrandPianoV3)
- [Landr Samples](https://samples.landr.com/) - snare, 808, moog
- Icons from The Noun Project:
  - https://thenounproject.com/search/?q=instrument&i=1544454
  - https://thenounproject.com/search/?q=volume&i=993436
  - https://thenounproject.com/search/?q=wave&i=990808
  - https://thenounproject.com/search/?q=speed&i=2349076
- Most notes are traced from Wikimedia [Musical score components](https://commons.wikimedia.org/wiki/Category:Musical_score_components) but some I have created by hand.
- Recurse Center for providing the space to work on this project!
