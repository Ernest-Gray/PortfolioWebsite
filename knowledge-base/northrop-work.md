# Ernest Gray — Northrop Grumman Work History

## Role
Software Engineer
Northrop Grumman — Linthicum Heights, MD
July 2023 – December 2025

## Summary
Developed embedded systems software and Python instrumentation for defense programs spanning airborne radar (F-16 APG-83 SABR), electronic warfare (Viper Shield), and large-scale physics test stand automation. Served as Tech Lead for a 5-engineer team. Contributed to a $29M Northrop Grumman contract.

---

## Project: Electronic Warfare Integration — Viper Shield ($29M Contract)

**Impact:** This integration contributed to a $29M contract for Northrop Grumman.

- Retrofitted and refactored an existing embedded OFP (Operational Flight Program) interface to integrate Viper Shield, an Electronic Warfare (EW) system.
- Required deep analysis of legacy C++ code and its hardware interactions to understand the existing architecture before making changes.
- Updated the Real-Time Simulation (RTS) software to model Viper Shield's mission-computer control path, enabling the Integration and Test (I&T) team to run full EW capability assessments against system requirements before hardware was available.

**Stack:** C++, embedded radar OFP, Electronic Warfare (EW) systems integration, Real-Time Simulation (RTS).

---

## Project: Embedded ML — F-16 APG-83 SABR Airborne Radar

The APG-83 SABR (Scalable Agile Beam Radar) is the production radar system on the F-16 fighter jet. Ernest implemented a machine learning model for real-time target identification.

**SVM Model Implementation:**
- Implemented a Support Vector Machine (SVM) classification model in embedded C++ for real-time airborne target ID on the F-16 APG-83 SABR radar.
- The model was designed to fill a gap in the Combat ID Decision Architecture (CIDA) — enhancing the platform's air-to-air identification capability.
- Converted MATLAB simulation models to production embedded C++ for the Operational Flight Program (OFP), maintaining numerical fidelity under real-time processing constraints.

**Signal Processing:**
- Developed signal processing routines to extract classification features from radar returns at runtime as inputs to the SVM.

**Embedded C++ Engineering:**
- Implemented memory-safe code using the platform's custom memory management and logging libraries.
- Ensured no memory leaks or null pointer exceptions under all tested code paths.
- Worked within strict embedded constraints (memory, timing, deterministic execution).

**Multi-Level Software Validation:**
- Executed validation across four levels: unit tests, software lab integration tests, hardware-in-the-loop system tests using tactical radar hardware, and open-air radiation tests.
- Performed statistical analysis with CIDA systems engineers to validate model performance metrics and develop a structured improvement roadmap.

**Stack:** C++, MATLAB (model origin), embedded real-time systems, SVM, custom platform libraries.

---

## Project: Python Instrumentation — Physics Test Stands (Tech Lead)

Led a 5-engineer software team integrating Python instrumentation across 5 experimental physics test stands.

**Leadership:**
- Led the team through development, code reviews, and delivery milestones.
- Collaborated with 3 partner teams to prepare capability demonstrations for program leadership and stakeholders.

**Bitstream Generation Framework:**
- Built a bitstream generation framework that let physics researchers construct complex test sequences through a higher-level API — reducing manual errors and cutting configuration time for sequences ranging from hundreds to tens-of-thousands of bits.

**Remote Instrument Control:**
- Designed remote control software for temperature sensors, pressure gauges, and valve controllers, enabling hands-off test-stand operation and automated data collection.

**Hardware Simulation:**
- Automated AWG (arbitrary waveform generator) sequence generation, transfer, and playback to simulate hardware outputs.
- Wrote oscilloscope control scripts to capture analog traces and parse them against expected digital simulation results.

**Data Visualization:**
- Built data visualization tools handling 1M+ data points from test stand measurements, enabling rapid review of experimental results by the physics team.

**Stack:** Python, NumPy, in-house instrumentation framework, AWG/oscilloscope control interfaces.

---

## Project: Nav-Playback Tool — Internal Developer Utility

- Designed and built a custom C++ application to replay Operational Flight Program (OFP) navigation functions and compare them against flight metrics.
- Enabled the team to evaluate new navigation algorithms and performance improvements without running live hardware tests — significantly reducing iteration time.
- Added MATLAB scripting support for data import/export so systems engineers could feed the tool from their existing MATLAB workflows.
- Designed custom 2D and 3D MATLAB plots for detailed navigation data visualization.

**Stack:** C++, MATLAB.

---

## Project: Radar Algorithm Development & Bug Fixes

- Collaborated weekly with a Senior Systems Engineer to design, implement, and validate new radar algorithms in MATLAB, then converted each iteration to embedded C++ for the Operational Flight Program.
- Diagnosed and resolved Electronic Protection (EP) defects by analyzing historical flight test data to identify root causes, implementing fixes, and validating against test datasets.

---

## Overall Impact at Northrop Grumman
- Contributed to a $29M Northrop Grumman contract via Viper Shield EW integration.
- Served as technical lead for a team of 5 engineers on critical defense infrastructure.
- Shipped ML-powered software running on active F-16 fighter jets.
- Gained experience across embedded ML, signal processing, electronic warfare, physics instrumentation, and defense software validation.
