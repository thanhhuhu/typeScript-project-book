import {useCurrentApp} from "../context/app.context.tsx";

const AppHeader = () => {
    const {user} = useCurrentApp();
    return (
        <>
            <div>App header</div>
            <div>
                {JSON.stringify(user)}
            </div>
        </>

    )
}
export default AppHeader;