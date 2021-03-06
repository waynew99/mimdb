import { render, screen, fireEvent } from "@testing-library/react";
import Submit from "./Submit";
//import fetchMock from "fetch-mock-jest";

jest.mock("next/router");

describe("Submit: Submitter tests", () => {
  const handler = jest.fn();
  //let container;
  const film = {
    title: "sample",
    logLine: "LogLine of the sample film",
    releaseDate: "F21",
    duration: "90",
    vimeoId: "vimeoId",
    overview: "Overview of the sample film"
  };

  beforeEach(async () => {

    handler.mockReset();

  })




  test.skip("Submit button posts new film", async () => {
    const { container } = render(<Submit complete={handler} />);

    const titleEditor = container.querySelector("input[id=Title]");
    const logLineEditor = container.querySelector(`input[id=Log-Line]`);
    const dateEditor = container.querySelector("input[id=Semester]");
    const durationEditor = container.querySelector("input[id=Duration]");
    const vimeoIdEditor = container.querySelector(`input[id=${"Vimeo ID".replace(/\s/g, "")}]`);
    const overviewEditor = container.querySelector("textarea");

    fireEvent.change(titleEditor, {
      target: { value: film.title },
    });
    fireEvent.change(logLineEditor, {
      target: { value: film.logLine },
    });
    fireEvent.change(dateEditor, {
      target: { value: film.releaseDate },
    });
    fireEvent.change(durationEditor, {
      target: { value: film.duration },
    });
    fireEvent.change(vimeoIdEditor, {
      target: { value: film.vimeoId },
    });
    fireEvent.change(overviewEditor, {
      target: { value: film.overview },
    });

    const button = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(button);

    expect(handler).toHaveBeenCalled();

    const newFilm = handler.mock.calls[0][0]; // value the handler was called with

    expect(newFilm.title).toEqual(film.title);
    expect(newFilm.overview).toEqual(film.overview);
    expect(newFilm.term).toEqual(film.releaseDate);
    expect(newFilm.duration).toEqual(film.duration);
    expect(newFilm.vimeoId).toEqual(film.vimeoId);
    expect(newFilm.logLine).toEqual(film.logLine);
  });
})