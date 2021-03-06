import ImdiGenerator from "./ImdiGenerator";
import { Project } from "../model/Project/Project";
import { Person } from "../model/Project/Person/Person";
import {
  setResultXml,
  xexpect as expect,
  count,
  value,
} from "../xmlUnitTestUtils";

import { CustomFieldRegistry } from "../model/Project/CustomFieldRegistry";
import { LanguageFinder } from "../languageFinder/LanguageFinder";

let project: Project;
let person: Person;
let generator: ImdiGenerator;
const pretendSessionDate = new Date("2010-06-06");

beforeAll(() => {
  project = Project.fromDirectory("sample data/Edolo sample");
  person = Person.fromDirectory(
    "sample data/Edolo sample/People/Awi Heole",
    new CustomFieldRegistry(),
    (oldName, newName) => true,
    new LanguageFinder(() => undefined)
  );
  // const subsetLanguageFinder = new LanguageFinder({
  //   englishName: "Edolo",
  //   iso639_3: "etr",
  // });

  generator = new ImdiGenerator(person, project);
  setResultXml(
    generator.actor(person, "pretend-role", pretendSessionDate) as string
    // ImdiGenerator.generateActor(
    //   person,
    //   project,
    //   true /*omit namespace*/,
    //   subsetLanguageFinder
    // )
  );
});
beforeEach(() => {});

describe("actor imdi export", () => {
  it("should contain Actor", () => {
    expect("Actor/Name").toMatch("Awi Heole");
    expect(count("Actor/Languages/Language")).toBe(3);
  });

  it("should label languages correctly", () => {
    expect("Actor/Languages/Language[1]/Id").toHaveText("ISO639-3:etr");
    expect("Actor/Languages/Language[2]/Id").toHaveText("ISO639-3:tpi");
    expect("Actor/Languages/Language[3]/Id").toHaveText("ISO639-3:hui");

    expect(
      "Actor/Languages/Language[Name[text()='Edolo']]/PrimaryLanguage[text()='true']"
    ).toHaveCount(1);

    /* "Mother Tongue" doesn't actually mean "mother's language". SM doesn't have a way to express MT at the moment.
    expect(
      "Actor/Languages/Language[Name[text()='Edolo']]/MotherTongue[text()='true']"
    ).toHaveCount(1);
    expect(
        "Actor/Languages/Language[Name[text()='Huli']]/MotherTongue[text()='false']"
    ).toHaveCount(1);*/
    expect(
      "Actor/Languages/Language[Name[text()='Huli']]/PrimaryLanguage[text()='false']"
    ).toHaveCount(1);
  });

  it("should calculate age in years given a birth year compared to pretendSessionDate", () => {
    expect("Actor/BirthDate").toMatch("1972");
    expect("Actor/Age").toMatch("38");
  });
  it("should handle birth year being empty the way ELAR wants it", () => {
    person.properties.setText("birthYear", "");
    const gen = new ImdiGenerator(person, project);
    const xml = gen.actor(person, "pretend-role", pretendSessionDate) as string;
    setResultXml(xml);
    expect("Actor/BirthDate").toMatch("Unspecified");
    expect("Actor/Age").toMatch("Unspecified");
  });
});
