/**
 * Fire risk factor definitions.
 *
 * These describe what each factor means and why it is considered. The weights themselves are
 * produced at runtime by `calculateRiskFactors()` in lib/calculations.js and are explicitly a
 * demonstration model, not measured risk probabilities.
 */

export const riskFactors = [
  {
    key: "oxygen",
    label: "Oxygen concentration",
    description:
      "Oxidiser availability sets the size of the reaction zone and strongly affects both visibility and how readily a fire can be sustained.",
    control: "Pressurisation control, oxidiser supply limits",
    icon: "droplets",
  },
  {
    key: "flow",
    label: "Flow / convection",
    description:
      "Forced airflow changes flame shape and stability and, above a threshold, becomes the primary suppression mechanism.",
    control: "Ventilation rate and direction",
    icon: "wind",
  },
  {
    key: "fuel",
    label: "Fuel type",
    description:
      "Fuel chemistry determines heat release, luminosity, sooting behaviour and whether the material sustains burning once ignited.",
    control: "Material selection and inventory restrictions",
    icon: "flame",
  },
  {
    key: "pressure",
    label: "Pressure",
    description:
      "Chamber pressure affects flame height, transport and the behaviour of any suppression agent delivered into the volume.",
    control: "Pressure regulation, agent delivery design",
    icon: "gauge",
  },
  {
    key: "temperature",
    label: "Temperature",
    description:
      "Ambient temperature shifts ignition thresholds, burn rates and how readily neighbouring materials are involved.",
    control: "Thermal control of the volume",
    icon: "thermometer",
  },
];

export const RISK_FACTOR_MAP = new Map(riskFactors.map((factor) => [factor.key, factor]));

export const OVERALL_RISK_NOTE =
  "The overall figure is the mean of the factor weights under the current environment modifiers. It is a demonstration of a scoring service, not a probability of fire.";
