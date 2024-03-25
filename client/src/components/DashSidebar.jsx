import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup,  HiAnnotation, HiChartPie, } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const [tab, setTab] = useState('');
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
    }, [location.search]);

    const handleSignout = async () => {
      try {
        const res = await fetch('/api/user/signout', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const getProfileLabel = () => {
      if (currentUser.isAdmin) {
        return 'Admin';
      } else if (currentUser.isEmp) {
        return 'Employer';
      } else if (currentUser.isInst) {
        return 'Institute';
      } else {
        return 'User';
      }
    };
    

    return (
        <Sidebar className='w-full md:w-56'>
          <Sidebar.Items>
          <Sidebar.ItemGroup className='flex flex-col gap-1'>

          {currentUser && (currentUser.isAdmin || currentUser.isEmp || currentUser.isInst) && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
              
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={getProfileLabel()}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item
                active={tab === 'posts'}
                icon={HiDocumentText}
                as='div'
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isEmp && (
            <Link to='/dashboard?tab=job'>
              <Sidebar.Item
                active={tab === 'job'}
                icon={HiDocumentText}
                as='div'
              >
                Jobs
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isInst && (
            <Link to='/dashboard?tab=course'>
              <Sidebar.Item
                active={tab === 'course'}
                icon={HiDocumentText}
                as='div'
              >
                Courses
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isAdmin && (
            <>
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                as='div'
              >
                Users
              </Sidebar.Item>
            </Link>
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item
                active={tab === 'comments'}
                icon={HiAnnotation}
                as='div'
              >
                Comments
              </Sidebar.Item>
            </Link>
          </>
                    )}
          
              <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer'onClick={handleSignout} >
                Sign Out
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      );
    }
