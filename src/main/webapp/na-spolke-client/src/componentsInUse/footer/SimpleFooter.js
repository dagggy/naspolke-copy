import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Kit 2 React components
import MKBox from "../../mkFiles/components/MKBox";
import MKTypography from "../../mkFiles/components/MKTypography";

// Material Kit 2 React base styles
import typography from "../../assets/theme/base/typography";

function SimpleFooter({ company, links, light }) {
    const { href, name } = company;
    const { size } = typography;

    const renderLinks = () =>
        links.map((link, key) => (
            <MKBox
                key={link.name}
                component="li"
                pl={key === 0 ? 0 : 2}
                pr={key === links.length - 1 ? 0 : 2}
                lineHeight={1}
            >
                <Link href={link.href} target="_blank">
                    <MKTypography variant="button" fontWeight="regular" color={light ? "white" : "text"}>
                        {link.name}
                    </MKTypography>
                </Link>
            </MKBox>
        ));

    return (
        <Container>
            <MKBox
                width="100%"
                display="flex"
                flexDirection={{ xs: "column", lg: "row" }}
                justifyContent="space-between"
                alignItems="center"
            >
                <MKBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexWrap="wrap"
                    color={light ? "white" : "text"}
                    fontSize={size.sm}
                >
                   Na Spółkę &copy; {new Date().getFullYear()}
                </MKBox>
                <MKBox
                    component="ul"
                    sx={({ breakpoints }) => ({
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "center",
                        listStyle: "none",
                        mt: 3,
                        mb: 0,
                        p: 0,

                        [breakpoints.up("lg")]: {
                            mt: 0,
                        },
                    })}
                >
                    {renderLinks()}
                </MKBox>
            </MKBox>
        </Container>
    );
}

// Setting default values for the props of SimpleFooter
SimpleFooter.defaultProps = {
    company: { href: "/", name: "Na spółkę" },
    links: [
        { href: "/", name: "Na spółkę" },
        { href: "/", name: "O nas" },
        { href: "/", name: "FAQ" },
        { href: "https://www.creative-tim.com/license", name: "License" },
    ],
    light: false,
};

// Typechecking props for the SimpleFooter
SimpleFooter.propTypes = {
    company: PropTypes.objectOf(PropTypes.string),
    links: PropTypes.arrayOf(PropTypes.object),
    light: PropTypes.bool,
};

export default SimpleFooter;