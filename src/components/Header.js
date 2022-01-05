
import styles from "../styles/NavBar.module.css";
import Category from "./Category";
import SearchBar from "./SearchBar";
import Link from "next/link";
import { useState } from "react";
import HamburgerButton from "./HamburgerButton";
import MenuDropDown from "./MenuDropDown";
import { GenreCourseContext } from "./context/GenreCourseContext";
import { useContext } from "react";
import { useSession, signOut } from "next-auth/client";

export default function Header() {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { genres, courses } = useContext(GenreCourseContext);
  const [session] = useSession();

  const buttonFunc = () => {
    setCategoriesOpen(!categoriesOpen);
  };


  return (
    <header>
      <div className={styles.navbar}>

        <Link href="/" passHref>
          <a className={`${styles.logo} noselect`} draggable={false}>
            <img draggable={false} alt="MIMDB" src="/mimdb-logo-full.svg" />
          </a>
        </Link>

        <div className={styles.filter}>

          <div className={styles.bigScreen}>
            <Category fieldName={"Genre"} fieldList={genres} />
            <Category fieldName={"Course"} fieldList={courses} />
            <SearchBar />
            <div className={styles.signInButton}>
              <Link href="/intro" passHref>
                {session ? `Welcome ${session.user.name}` : "Sign in / Sign up"}
              </Link>
            </div>
            {session && <button onClick={signOut}>Sign Out</button>}
          </div>

          <div className={styles.smallScreen}>
            <SearchBar />
            <HamburgerButton style={styles.menuButton} select={buttonFunc} />
            {(categoriesOpen) ?
              <MenuDropDown styleCont={styles.dropDownContainerShow} styleList={styles.dropDownList} />
              :
              null}
          </div>

        </div>

      </div>
    </header>
  );
}
