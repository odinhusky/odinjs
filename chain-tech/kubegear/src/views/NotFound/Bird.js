import React from 'react';
import c from 'classnames';
import bird from './Bird.module.scss';

const Bird = () => {
  return (
    <div className={bird.globe}>
      <div className={bird.bird}>
        <div className={bird.body}>
          <div className={c(bird.eye, bird.left)} />
          <div className={c(bird.eye, bird.right)} />
          <div className={bird.beak}><div /></div>
          <div className={bird.feet} />
          <div className={bird.wire} />
        </div>
        <div className={bird.hills} />
        <div className={bird.cloud} />
        <div className={c(bird.cloud, bird.small)} />
      </div>
    </div>
  );
};

export default Bird;
