import DirectorPage from "./DirectorPage";
import { screen, render } from "@testing-library/react";

    const director =
        {
        directorName: "Wayne Wang",
        directorId: 1,
        directorBio: "I'm actually a programmer.",
        directorMiddEmail: "midd@middlebury.edu",
        directorPersonalEmail: "personal@domain.com",
        directorClassYear: "2022.5"
    }
    


describe("Director Page Tests", () => {
    // eslint-disable-next-line no-unused-vars
    let selectFunction;
    

    test.only("Director Info", async () => {
    selectFunction = jest.fn();

      render(<DirectorPage film director={director}/>);

      expect(screen.getByTestId("directorPageName").textContent).toBe(director.directorName);

      expect(screen.getByTestId("directorBio").textContent).toBe(director.directorBio);

      expect(screen.getByTestId("directorMiddEmail").textContent).toBe(director.directorMiddEmail);

      expect(screen.getByTestId("directorPerseEmail").textContent).toBe(director.directorPersonalEmail);

      expect(screen.getByTestId("directorPerseEmail").textContent).toBe(director.directorPersonalEmail);



      });  
})
