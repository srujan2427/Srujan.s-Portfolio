export default function IntroBattleground() {
  return (
    <div className="intro-world" aria-hidden="true">
      <div className="intro-sun" />
      <div className="intro-cloud intro-cloud-one" />
      <div className="intro-cloud intro-cloud-two" />
      <div className="intro-dust intro-dust-one" />
      <div className="intro-dust intro-dust-two" />
      <div className="intro-horizon" />
      <div className="intro-ridge intro-ridge-back" />
      <div className="intro-ridge intro-ridge-front" />
      <div className="intro-road" />

      {/* The buggy follows from the right; its passenger fires left */}
      <div className="intro-car intro-dune-buggy">
        <span className="intro-buggy-rollbar" />
        <span className="intro-buggy-seat" />
        <span className="intro-car-wheel intro-car-wheel-left" />
        <span className="intro-car-wheel intro-car-wheel-right" />
        <span className="intro-car-light" />
        <span className="intro-passenger">
          <span className="intro-passenger-head" />
          <span className="intro-passenger-body" />
          <span className="intro-smg" />
          <span className="intro-muzzle-flash" />
        </span>
        <svg className="intro-tracer-arc" viewBox="0 0 260 80" preserveAspectRatio="none">
          <path className="intro-tracer-arc-one" d="M255 10 Q145 13 8 55" />
          <path className="intro-tracer-arc-two" d="M255 20 Q150 29 12 67" />
        </svg>
      </div>

      {/* The armored vehicle leads on the left and receives the hits */}
      <div className="intro-car intro-armored-vehicle">
        <span className="intro-armored-roof" />
        <span className="intro-armored-window" />
        <span className="intro-armored-grille" />
        <span className="intro-car-wheel intro-car-wheel-left" />
        <span className="intro-car-wheel intro-car-wheel-right" />
        <span className="intro-car-light" />
        <span className="intro-impact intro-impact-one" />
        <span className="intro-impact intro-impact-two" />
        <span className="intro-impact intro-impact-three" />
        <span className="intro-impact intro-impact-four" />
        <span className="intro-hit-debris intro-hit-debris-one" />
        <span className="intro-hit-debris intro-hit-debris-two" />
        <span className="intro-hit-debris intro-hit-debris-three" />
        <span className="intro-hit-debris intro-hit-debris-four" />
      </div>

      <div className="intro-grit intro-grit-one" />
      <div className="intro-grit intro-grit-two" />
      <div className="intro-debris intro-debris-one" />
      <div className="intro-debris intro-debris-two" />
      <div className="intro-vignette" />
    </div>
  );
}
