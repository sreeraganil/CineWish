import './christmas.css'

const SNOWFLAKE_COUNT = 20;

const random = (min, max) => Math.random() * (max - min) + min;

const snowflakes = Array.from({ length: SNOWFLAKE_COUNT }).map((_, index) => ({
  id: index,
  left: `${random(0, 100)}%`,
  size: `${random(2,10)}`,
  duration: `${random(8, 20)}`,
  delay: `${random(0, 10)}`,
}));




const SnowFall = () => {
  return (
    <div className="absolute -inset-4">
        <div className="bg relative h-full w-full">
          <img className='w-1/4 absolute right-0 top-0' src="/events/christmas/decorator.png" alt="" srcset="" />
          {
          snowflakes?.map(s => (
            <img
            key={s.id}
            src="/events/christmas/snowflake.png"
            alt=""
            className="absolute -top-2 pointer-events-none"
            style={{
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animation: `snowfall ${s.duration}s linear ${s.delay}s infinite`
            }}
          />
          ))
        }
        </div>
    </div>
  )
}

export default SnowFall