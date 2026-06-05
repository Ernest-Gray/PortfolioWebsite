# Ernest Gray — Northrop Grumman Work History

## Role
Software Engineer / Software Tech Lead
Northrop Grumman — Linthicum Heights, MD
July 2023 – November 2025
Security Clearance: Active/Secret

---

## Project: Software Tech Lead — MDA (Microelectronics Design and Application)

Led a software team of four engineers to integrate software on five test-stands that helped physicists conduct more experiments. The work enabled the physics team to run more experiments faster and with fewer errors.

**Bitstream Generation Tools:**
- Created bitstream generation tools for physicists so they could form complicated bitstreams (hundreds to tens-of-thousands of bits long) easier, faster, with less errors, and more utility
- Tools replaced manual error-prone processes with automated, validated generation pipelines

**Test-Stand Remote Communication Software:**
- Designed software to help the team remotely communicate with temperature, pressure, and valve controllers on the test-stands
- Enabled remote monitoring and control of physical lab equipment from software interfaces

**Python Framework Integration:**
- Learned, updated, and applied the in-house Python framework to the team's test-stands
- Adapted existing internal tooling for new experimental configurations

**Stakeholder Demonstrations:**
- Collaborated with 3 other teams to create demonstrations showcasing major developments of the project to leadership and major stakeholders

**Hardware Simulation with Oscilloscopes and AWGs:**
- Used oscilloscopes and arbitrary waveform generators (AWGs) to playback generated test vectors to simulate hardware outputs and verify software validity
- Created scripts to generate, transfer, and play sequences for arbitrary waveform generators
- Wrote scripts to configure and read data from oscilloscopes
- Simulated physical hardware outputs with AWGs and oscilloscopes to test against known digital simulations
- Created scripts to read off values from the scope and parse analog traces to expected output bitstream

**Data Visualization:**
- Developed multiple utility plots to efficiently represent large amounts (1 million+ data points) of data gathered from the test stand

**Technologies:** Python, NumPy, oscilloscope control APIs, AWG programming, data visualization

---

## Project: Machine Learning Algorithm for Enhanced Combat ID — F-16 SABR Radar

**Context:** Scalable Agile Beam Radar (SABR) — F-16 Fighter Jet Embedded Software
Embedded C++, MATLAB

**ML Model Implementation:**
- Implemented a machine learning model designed for Combat ID Decision Architecture (CIDA)
- The model — a Support Vector Machine (SVM) — was designed to enhance CIDA to resolve a gap in key F-16 air-to-air identification requirements
- Converted MATLAB models into embedded C++ code for the Operational Flight Program (OFP) — the actual flight software running on the F-16

**Signal Processing:**
- Developed signal processing code to extract combat ID features during runtime as inputs into the SVM weights
- Features extracted from radar returns were fed into the SVM for real-time classification

**Embedded C++ Engineering:**
- Ensured proper error catching logic to prevent memory leaks and null pointer exceptions
- Learned and designed code around the radar's custom library for memory management and logging
- Used object-oriented paradigms and reused existing parts code while expanding when necessary
- Worked within strict embedded constraints (memory, timing, safety)

**Multi-Level Software Testing:**
- Created, executed, and analyzed data from multi-level software tests:
  - Simulations
  - Software lab tests
  - System lab tests using the tactical radar hardware and open-air radiation
- Performed statistical analysis with CIDA system engineers over results of gathered data
- Validated performance of the model and strategized for improvements based on results

**Technologies:** C++, MATLAB, embedded systems, signal processing, SVM, military radar systems

---

## Overall Impact at Northrop Grumman
- Served as technical lead for a team of 4 engineers on critical defense infrastructure
- Contributed to both physics research infrastructure (test-stand automation) and active fighter jet systems (F-16 SABR radar ML)
- Gained experience in embedded ML, signal processing, physics instrumentation, and defense software validation
- Worked with Active/Secret clearance on programs involving classified defense systems
