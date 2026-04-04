\# PROG2005 Assessment 2 - Inventory Management System



\*\*Author:\*\* BaoJie001  

\*\*Student ID:\*\* \[24831941]  

\*\*Date:\*\* 2026-04-04  

\*\*GitHub Repository:\*\* https://github.com/BaoJie001/PROG2005-A2



\---



\## 📋 Overview



This project implements an inventory management system in two versions:



\- \*\*Part 1:\*\* TypeScript-based standalone application

\- \*\*Part 2:\*\* Angular-based multi-page application



Both applications run entirely in the browser with no server-side interaction. Data persists only during the current session.



\---



\## ✅ Features Implemented



\### Common Features (Both Parts)



| Feature | Status |

|---------|--------|

| Add new items | ✅ |

| Edit/Update items by name | ✅ |

| Delete items with confirmation | ✅ |

| Search items by name | ✅ |

| Display all items | ✅ |

| Display popular items | ✅ |

| Responsive design (mobile + desktop) | ✅ |

| Custom HTML dialogs (no alert/confirm) | ✅ |

| Input validation | ✅ |



\### Part 2 Only (Angular)



| Page | Content |

|------|---------|

| Home | Introduction and feature overview |

| Inventory | Add, edit, delete, view all, view popular |

| Search | Search by name + filter by category and stock status |

| Privacy | Privacy and security analysis |

| Help | FAQ and troubleshooting guide |



\---



\## 🚀 How to Run



\### Part 1 (TypeScript)



```bash

cd part1-typescript

tsc app.ts

\# Open index.html in browser



\### Part 2 (Angular)

cd part2-angular/inventory-app

npm install

ng serve

\# Open http://localhost:4200





