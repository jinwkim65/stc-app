## CPSC 419 Project Overview

We are developing a web application with two primary objectives: to assist STC cluster technicians (CTs) in effectively managing inventory through an intuitive interface and to automate the process of assigning CTs to specific locations within a campus cluster. 

Cluster technicians are tasked with maintaining printers and computers at various locations across campus, each divided into four zones. These zones typically encompass eight locations and a central hub. At each location, CTs manage items such as printers, paper, toner, computers, and peripherals. 

Traditionally, CTs determine their shift locations independently, visiting around four locations per shift within their designated zone. However, starting this semester, locations are pre-assigned by CT coordinators (COORDS), necessitating a manual process. Our goal is to automate this assignment process, prioritizing locations that haven't been visited recently. Additionally, factors like location proximity will influence shift assignments; for example, distant locations may warrant fewer assigned visits.

In addition to location assignment automation, we aim to enhance inventory management by replacing an existing Excel sheet with a more robust database system. This system will provide a seamless user experience for updating and tracking inventory counts.

### Proposed Tech Stack
- **React JS**: Frontend User Interface
- **PostgreSQL**: Database Management
- **Flask**: Backend Development

### Additional Features
- **General User Side**: Interface for users to see location statuses and upvote location priority.
- **Cluster Tech Side**: Interface for CTs to view assigned locations and update inventory counts.
- **Admin Side**: Interface for administrators to interact with the location scheduling algorithm and manage system settings.