export interface AcademicSubjectOption {
  name: string;
  category: string;
  popularTopics: string[];
  branches: string[]; // Branch keys or keywords that this subject applies to
}

export const ACADEMIC_BRANCHES: string[] = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science (AI/DS)',
  'Electrical & Electronics Engineering (EEE)',
  'Electronics & Communication Engineering (ECE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Chemical Engineering',
  'Biotechnology & Biomedical Engineering',
  'Aerospace & Aeronautical Engineering',
  'Robotics & Automation',
  'Electrical & Instrumentation Engineering',
];

export const ACADEMIC_SUBJECTS: AcademicSubjectOption[] = [
  // ================= Computer Science, IT, AI & Data Science =================
  {
    name: 'Operating Systems',
    category: 'Computer Science & IT',
    branches: ['cse', 'it', 'ai/ds'],
    popularTopics: ['CPU Scheduling & Algorithms', 'Process Synchronization & Semaphores', 'Deadlock Detection & Prevention', 'Virtual Memory & Paging'],
  },
  {
    name: 'Data Structures & Algorithms',
    category: 'Computer Science & IT',
    branches: ['cse', 'it', 'ai/ds'],
    popularTopics: ['Binary Search Trees & AVL Trees', 'Graph Algorithms (Dijkstra, BFS/DFS)', 'Dynamic Programming & Memoization', 'Sorting & Time Complexity Analysis'],
  },
  {
    name: 'Database Management Systems (DBMS)',
    category: 'Computer Science & IT',
    branches: ['cse', 'it', 'ai/ds'],
    popularTopics: ['Relational Normalization (1NF to BCNF)', 'Transaction ACID Properties & Concurrency', 'Indexing (B-Trees & Hash Indexing)', 'SQL Query Optimization'],
  },
  {
    name: 'Computer Networks',
    category: 'Computer Science & IT',
    branches: ['cse', 'it', 'ai/ds'],
    popularTopics: ['TCP/IP vs OSI Protocol Stack', 'Congestion Control & Flow Control', 'Routing Algorithms (OSPF & BGP)', 'Subnetting & CIDR Notation'],
  },
  {
    name: 'Machine Learning & AI',
    category: 'Computer Science & IT',
    branches: ['cse', 'it', 'ai/ds', 'robotics'],
    popularTopics: ['Backpropagation & Gradient Descent', 'Convolutional Neural Networks (CNN)', 'Support Vector Machines (SVM)', 'Reinforcement Learning & Markov Decision Processes'],
  },
  {
    name: 'Software Engineering & System Design',
    category: 'Computer Science & IT',
    branches: ['cse', 'it', 'ai/ds'],
    popularTopics: ['Microservices & Scalability', 'Object-Oriented Design Patterns', 'RESTful API & Distributed Caching', 'Agile & CI/CD Pipelines'],
  },
  {
    name: 'Theory of Computation & Automata',
    category: 'Computer Science & IT',
    branches: ['cse', 'it'],
    popularTopics: ['Finite Automata (DFA/NFA)', 'Context-Free Grammars & Pushdown Automata', 'Turing Machines & Decidability', 'Chomsky Hierarchy'],
  },
  {
    name: 'Compiler Design',
    category: 'Computer Science & IT',
    branches: ['cse', 'it'],
    popularTopics: ['Lexical Analysis & Lex', 'LL(1) & LR(1) Parsers', 'Syntax Directed Translation', 'Code Optimization & Register Allocation'],
  },
  {
    name: 'Object-Oriented Programming (Java / C++)',
    category: 'Computer Science & IT',
    branches: ['cse', 'it', 'ai/ds'],
    popularTopics: ['Polymorphism & Inheritance', 'Memory Management & Pointers', 'Exception Handling & Generics', 'Multithreading & Concurrency'],
  },
  {
    name: 'Deep Learning & Natural Language Processing',
    category: 'Artificial Intelligence & Data Science',
    branches: ['ai/ds', 'cse'],
    popularTopics: ['Transformer Attention Mechanisms', 'BERT & LLM Pretraining', 'Recurrent Neural Networks (LSTM/GRU)', 'Generative Adversarial Networks (GANs)'],
  },

  // ================= Electrical & Electronics Engineering (EEE) =================
  {
    name: 'Power Systems',
    category: 'Electrical & Electronics',
    branches: ['eee'],
    popularTopics: ['Power System Stability & Equal Area Criterion', 'Gauss-Seidel & Newton-Raphson Load Flow', 'Symmetrical & Unsymmetrical Fault Analysis', 'Transmission Line Parameters & Ferranti Effect'],
  },
  {
    name: 'Electrical Machines',
    category: 'Electrical & Electronics',
    branches: ['eee', 'robotics'],
    popularTopics: ['Synchronous Motor Torque-Angle Characteristics', 'Three-Phase Induction Motor Torque-Speed Curve', 'DC Motor Speed Control & Braking', 'Transformer Equivalent Circuit & Efficiency'],
  },
  {
    name: 'Power Electronics & Drives',
    category: 'Electrical & Electronics',
    branches: ['eee', 'instrumentation', 'robotics'],
    popularTopics: ['DC-DC Buck & Boost Converters', 'PWM Inverters & Harmonic Distortion', 'Thyristor / MOSFET Switching Dynamics', 'V/f Speed Control of Induction Motors'],
  },
  {
    name: 'Transmission & Distribution',
    category: 'Electrical & Electronics',
    branches: ['eee'],
    popularTopics: ['Corona Loss & Radio Interference', 'Underground Cables & Grading', 'Substation Design & Busbar Schemes', 'Overhead Insulators & String Efficiency'],
  },
  {
    name: 'Electromagnetic Field Theory',
    category: 'Electrical & Electronics',
    branches: ['eee', 'ece'],
    popularTopics: ['Maxwell Equations in Differential Form', 'Poynting Theorem & Energy Flow', 'Boundary Conditions in Dielectrics & Conductors', 'Waveguides & Skin Depth'],
  },
  {
    name: 'Control Systems',
    category: 'Electrical & Electronics',
    branches: ['eee', 'ece', 'instrumentation', 'robotics'],
    popularTopics: ['Bode Plots & Gain/Phase Margins', 'Root Locus Construction & Stability', 'State-Space Representation & Controllability', 'Routh-Hurwitz Stability Criterion'],
  },
  {
    name: 'Digital Electronics',
    category: 'Electrical & Electronics',
    branches: ['eee', 'ece', 'instrumentation', 'robotics'],
    popularTopics: ['Sequential Logic & Flip-Flop State Machines', 'Combinational Logic & Karnaugh Maps', 'Counters & Shift Registers', 'CMOS Logic Families & Propagation Delay'],
  },

  // ================= Electronics & Communication Engineering (ECE) =================
  {
    name: 'Signals & Systems',
    category: 'Electronics & Communication',
    branches: ['ece', 'eee', 'instrumentation'],
    popularTopics: ['Continuous & Discrete Fourier Transform', 'Laplace & Z-Transform Region of Convergence', 'LTI System Impulse Response & Convolution', 'Nyquist Sampling Theorem'],
  },
  {
    name: 'Analog & Digital Communication',
    category: 'Electronics & Communication',
    branches: ['ece'],
    popularTopics: ['QPSK, QAM & Constellation Diagrams', 'PCM & Quantization Noise Analysis', 'Information Theory & Shannon Capacity', 'Amplitude & Frequency Modulation (AM/FM)'],
  },
  {
    name: 'VLSI Design & Embedded Systems',
    category: 'Electronics & Communication',
    branches: ['ece', 'eee'],
    popularTopics: ['CMOS Inverter VTC & Propagation Delay', 'Verilog HDL Sequential Modeling', 'Static Timing Analysis (Setup & Hold Time)', 'FPGA Architecture & Synthesis'],
  },
  {
    name: 'Microprocessors & Microcontrollers',
    category: 'Electronics & Communication',
    branches: ['ece', 'eee', 'instrumentation', 'robotics'],
    popularTopics: ['ARM Cortex Architecture & Interrupts', '8086 Instruction Set & Memory Segmentation', 'Timer, ADC & UART Peripheral Interfacing', 'RTOS Scheduling & Tasks'],
  },
  {
    name: 'Digital Signal Processing (DSP)',
    category: 'Electronics & Communication',
    branches: ['ece'],
    popularTopics: ['FFT Cooley-Tukey Algorithms', 'FIR Filter Design (Window Method)', 'IIR Filter Bilinear Transformation', 'Multirate DSP & Decimation/Interpolation'],
  },
  {
    name: 'Electromagnetic Waves & Antennas',
    category: 'Electronics & Communication',
    branches: ['ece'],
    popularTopics: ['Dipole Antenna Radiation Pattern', 'Antenna Array Factor & Beamforming', 'Friis Transmission Equation', 'Smith Chart Impedance Matching'],
  },

  // ================= Mechanical Engineering (ME) =================
  {
    name: 'Thermodynamics',
    category: 'Mechanical Engineering',
    branches: ['me', 'aerospace', 'chemical'],
    popularTopics: ['First & Second Laws of Thermodynamics', 'Carnot Cycle & Entropy Generation', 'Rankine & Brayton Power Cycles', 'Pure Substances & Steam Tables'],
  },
  {
    name: 'Fluid Mechanics & Hydraulic Machinery',
    category: 'Mechanical Engineering',
    branches: ['me', 'aerospace', 'civil', 'chemical'],
    popularTopics: ['Bernoulli Equation & Energy Head', 'Navier-Stokes Equations & Viscous Flow', 'Boundary Layer Theory & Drag', 'Centrifugal Pumps & Pelton Turbines'],
  },
  {
    name: 'Strength of Materials',
    category: 'Mechanical Engineering',
    branches: ['me', 'civil', 'aerospace'],
    popularTopics: ['Shear Force & Bending Moment Diagrams', 'Mohr’s Circle for Plane Stress', 'Torsion of Circular Shafts', 'Euler’s Column Buckling Formula'],
  },
  {
    name: 'Heat Transfer',
    category: 'Mechanical Engineering',
    branches: ['me', 'aerospace', 'chemical'],
    popularTopics: ['One-Dimensional Steady-State Conduction (Fourier Law)', 'Convective Heat Transfer & Nusselt Number', 'Radiation Heat Exchange & Stefan-Boltzmann Law', 'Heat Exchanger LMTD & NTU Methods'],
  },
  {
    name: 'Kinematics & Dynamics of Machinery',
    category: 'Mechanical Engineering',
    branches: ['me', 'robotics'],
    popularTopics: ['Four-Bar Linkage Synthesis & Grashof Rule', 'Gear Trains & Epicyclic Ratios', 'Balancing of Rotating & Reciprocating Masses', 'Gyroscopic Effect & Precession'],
  },
  {
    name: 'Manufacturing Technology & Machining',
    category: 'Mechanical Engineering',
    branches: ['me'],
    popularTopics: ['Merchant Circle Force Analysis in Metal Cutting', 'CNC Part Programming (G & M Codes)', 'Casting Solidification & Riser Design', 'Welding Heat Input & Heat Affected Zone'],
  },
  {
    name: 'Finite Element Analysis (FEA)',
    category: 'Mechanical Engineering',
    branches: ['me', 'civil', 'aerospace'],
    popularTopics: ['1D Bar & Truss Element Stiffness Matrix', '2D Constant Strain Triangle (CST)', 'Isoparametric Formulations & Gauss Quadrature', 'Modal Analysis & Natural Frequencies'],
  },

  // ================= Civil Engineering (CE) =================
  {
    name: 'Structural Analysis',
    category: 'Civil Engineering',
    branches: ['civil'],
    popularTopics: ['Moment Distribution Method', 'Deflection by Castigliano Theorem', 'Truss Analysis (Method of Joints/Sections)', 'Influence Lines for Statically Determinate Beams'],
  },
  {
    name: 'Design of Reinforced Concrete Structures (RCC)',
    category: 'Civil Engineering',
    branches: ['civil'],
    popularTopics: ['Limit State Method for Flexure & Shear', 'Singly & Doubly Reinforced Beam Design', 'Two-Way Slab Moment Coefficients', 'Axially Loaded Column & Footing Design'],
  },
  {
    name: 'Geotechnical & Soil Mechanics',
    category: 'Civil Engineering',
    branches: ['civil'],
    popularTopics: ['Terzaghi One-Dimensional Consolidation', 'Mohr-Coulomb Shear Strength Criterion', 'Earth Pressure on Retaining Walls (Rankine/Coulomb)', 'Bearing Capacity of Shallow Foundations'],
  },
  {
    name: 'Surveying & Geomatics',
    category: 'Civil Engineering',
    branches: ['civil'],
    popularTopics: ['Traverse Computation & Bowditch Rule', 'Leveling & Profile Levelling', 'Total Station & GPS Coordinate Systems', 'Curve Ranging (Simple & Transition Curves)'],
  },
  {
    name: 'Environmental Engineering & Hydrology',
    category: 'Civil Engineering',
    branches: ['civil', 'chemical'],
    popularTopics: ['Activated Sludge Process (BOD/COD Kinetics)', 'Water Treatment Coagulation & Rapid Sand Filters', 'Unit Hydrograph & Flood Routing', 'Groundwater Darcy Law & Well Hydraulics'],
  },
  {
    name: 'Transportation & Highway Engineering',
    category: 'Civil Engineering',
    branches: ['civil'],
    popularTopics: ['Geometric Design & Stopping Sight Distance', 'Flexible Pavement CBR Design Method', 'Traffic Flow Parameters & Green-shields Model', 'Marshall Stability Test for Bituminous Mixes'],
  },

  // ================= Chemical Engineering =================
  {
    name: 'Chemical Reaction Engineering',
    category: 'Chemical Engineering',
    branches: ['chemical'],
    popularTopics: ['Ideal Reactors Design Equations (CSTR vs PFR)', 'Arrhenius Temperature Dependence & Activation Energy', 'Multiple Reactions & Selectivity Optimization', 'Catalyst Deactivation & Diffusion in Pores'],
  },
  {
    name: 'Mass Transfer Operations',
    category: 'Chemical Engineering',
    branches: ['chemical'],
    popularTopics: ['McCabe-Thiele Method for Fractional Distillation', 'Fick Law of Molecular Diffusion', 'Absorption Column Design & NTU/HTU', 'Liquid-Liquid Extraction & Ternary Diagrams'],
  },
  {
    name: 'Process Dynamics & Control',
    category: 'Chemical Engineering',
    branches: ['chemical', 'instrumentation'],
    popularTopics: ['First & Second Order Process Transfer Functions', 'PID Controller Tuning (Ziegler-Nichols)', 'Closed-Loop Stability Analysis', 'Cascade & Feedforward Control Strategies'],
  },

  // ================= Biotechnology & Biomedical Engineering =================
  {
    name: 'Bioprocess Engineering & Fermentation',
    category: 'Biotechnology & Biomedical',
    branches: ['biotech'],
    popularTopics: ['Monod Microbial Growth Kinetics', 'Bioreactor Oxygen Transfer (kLa Determination)', 'Downstream Chromatography & Ultrafiltration', 'Sterilization Kinetics of Media & Air'],
  },
  {
    name: 'Molecular Biology & Genetic Engineering',
    category: 'Biotechnology & Biomedical',
    branches: ['biotech'],
    popularTopics: ['Recombinant DNA Technology & Plasmids', 'PCR Primer Design & Amplification', 'CRISPR-Cas9 Gene Editing Principles', 'Gel Electrophoresis & Western Blotting'],
  },
  {
    name: 'Biomedical Instrumentation & Sensors',
    category: 'Biotechnology & Biomedical',
    branches: ['biotech', 'instrumentation'],
    popularTopics: ['ECG, EEG & EMG Biopotential Amplifiers', 'Optical Biosensors & Enzyme Electrodes', 'Medical Imaging Systems (MRI, Ultrasound)', 'Blood Pressure & Flow Measurement'],
  },

  // ================= Aerospace & Aeronautical Engineering =================
  {
    name: 'Aerodynamics & Flight Mechanics',
    category: 'Aerospace Engineering',
    branches: ['aerospace'],
    popularTopics: ['Incompressible Flow over Airfoils (Kutta-Joukowski)', 'Shock Waves & Supersonic Expansion Fans', 'Aircraft Longitudinal Static Stability', 'Induced Drag & Finite Wing Theory'],
  },
  {
    name: 'Aircraft Propulsion & Gas Turbines',
    category: 'Aerospace Engineering',
    branches: ['aerospace', 'me'],
    popularTopics: ['Brayton Cycle for Turbojets & Turbofans', 'Axial Compressor Stage Velocity Triangles', 'Rocket Propulsion Thrust Equation (Isp & Delta-V)', 'Combustion Chamber Efficiency & Flame Holders'],
  },

  // ================= Robotics & Automation =================
  {
    name: 'Robot Kinematics & Dynamics',
    category: 'Robotics & Automation',
    branches: ['robotics', 'me'],
    popularTopics: ['Denavit-Hartenberg (D-H) Forward Kinematics', 'Inverse Kinematics Geometric Solutions', 'Jacobian Matrix & Singularities Analysis', 'Euler-Lagrange Dynamic Formulation of Manipulators'],
  },
  {
    name: 'Industrial Automation & PLCs',
    category: 'Robotics & Automation',
    branches: ['robotics', 'instrumentation', 'eee'],
    popularTopics: ['PLC Ladder Logic & Timers/Counters', 'SCADA Architecture & Fieldbus Protocols', 'Pneumatic & Hydraulic Actuator Circuits', 'Industrial Sensor Interfacing & Signal Conditioning'],
  },

  // ================= Electrical & Instrumentation Engineering =================
  {
    name: 'Process Instrumentation & Transducers',
    category: 'Instrumentation Engineering',
    branches: ['instrumentation'],
    popularTopics: ['RTD, Thermocouple & Thermistor Characteristics', 'LVDT & Strain Gauge Bridge Circuits', 'Flow Measurement (Venturi, Orifice, Coriolis)', 'Capacitive & Ultrasonic Level Measurement'],
  },

  // ================= Core Engineering Mathematics & Sciences (Common to all) =================
  {
    name: 'Engineering Mathematics',
    category: 'Mathematics & Core Sciences',
    branches: ['all'],
    popularTopics: ['Eigenvalues & Eigenvectors Diagonalization', 'Multiple Integrals & Vector Calculus (Gauss/Stokes)', 'Partial Differential Equations (Wave & Heat Equation)', 'Complex Variables & Residue Theorem'],
  },
  {
    name: 'Probability & Statistics',
    category: 'Mathematics & Core Sciences',
    branches: ['all', 'cse', 'it', 'ai/ds'],
    popularTopics: ['Random Variables & Expectation', 'Normal, Poisson & Binomial Distributions', 'Hypothesis Testing & p-Values', 'Bayes Theorem & Conditional Probability'],
  },
  {
    name: 'Engineering Physics',
    category: 'Mathematics & Core Sciences',
    branches: ['all', 'eee', 'ece', 'me', 'civil'],
    popularTopics: ['Quantum Mechanics & Wave Functions', 'Laser Physics & Optical Fibers', 'Semiconductor Energy Bands & Fermi Level', 'Electromagnetism & Maxwell Equations'],
  },
];

/**
 * Normalizes branch name to a standardized branch key
 */
export function getBranchKey(branchName?: string): string {
  if (!branchName) return '';
  const lower = branchName.toLowerCase();

  if (lower.includes('computer') || lower.includes('cse') || lower.includes('software')) return 'cse';
  if (lower.includes('information technology') || lower.includes('it')) return 'it';
  if (lower.includes('artificial') || lower.includes('ai') || lower.includes('data science')) return 'ai/ds';
  if (lower.includes('electrical & electronics') || lower.includes('eee')) return 'eee';
  if (lower.includes('electronics & communication') || lower.includes('ece') || lower.includes('telecom')) return 'ece';
  if (lower.includes('mechanical') || lower.includes('automobile')) return 'me';
  if (lower.includes('civil') || lower.includes('structural')) return 'civil';
  if (lower.includes('chemical')) return 'chemical';
  if (lower.includes('bio')) return 'biotech';
  if (lower.includes('aero')) return 'aerospace';
  if (lower.includes('robot')) return 'robotics';
  if (lower.includes('instrumentation')) return 'instrumentation';

  return lower;
}

/**
 * Returns subjects strictly belonging to the chosen academic branch (plus general foundational subjects).
 * If no branch is selected or custom branch not mapped, returns all available subjects.
 */
export function getSubjectsForBranch(branchName?: string): AcademicSubjectOption[] {
  if (!branchName || !branchName.trim()) {
    return ACADEMIC_SUBJECTS;
  }

  const branchKey = getBranchKey(branchName);

  const matched = ACADEMIC_SUBJECTS.filter(subject => {
    // Core foundational subjects always available
    if (subject.branches.includes('all')) return true;

    // Direct branch key match
    if (subject.branches.includes(branchKey)) return true;

    // Cross-discipline matches
    if (branchKey === 'ai/ds' && subject.branches.includes('cse')) return true;
    if (branchKey === 'it' && subject.branches.includes('cse')) return true;

    return false;
  });

  return matched.length > 0 ? matched : ACADEMIC_SUBJECTS;
}
